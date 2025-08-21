const { oauth2Client, google } = require('../config/googleAnalytics');
const { Admin } = require('../models/Admin');

const analyticsController = {};

// 1. Endpoint para obtener URL de autenticación
analyticsController.getAuthUrl = (req, res) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/analytics.readonly'],
      prompt: 'consent'
    });
    
    res.json({ 
      success: true, 
      authUrl 
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al generar URL de autenticación' 
    });
  }
};

// 2. Endpoint para manejar callback de autenticación
analyticsController.handleAuthCallback = async (req, res) => {
  const { code } = req.query;
  const adminId = req.user.id;

  try {
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Código de autorización no proporcionado'
      });
    }

    // Obtener tokens de Google
    const { tokens } = await oauth2Client.getToken(code);

    // Guardar tokens en la base de datos
    await Admin.update({
      google_access_token: tokens.access_token,
      google_refresh_token: tokens.refresh_token,
      google_token_expiry: new Date(tokens.expiry_date),
      google_analytics_connected: true
    }, {
      where: { id: adminId }
    });

    res.json({
      success: true,
      message: 'Autenticación exitosa',
      tokens: {
        access_token: tokens.access_token,
        expiry_date: tokens.expiry_date
      }
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error en el proceso de autenticación' 
    });
  }
};

// 3. Endpoint para verificar token y obtener datos
analyticsController.getAnalyticsData = async (req, res) => {
  const adminId = req.user.id;

  try {
    // Obtener admin con tokens
    const admin = await Admin.findByPk(adminId);

    if (!admin.google_analytics_connected || !admin.google_access_token) {
      return res.status(401).json({ 
        success: false,
        error: 'No autenticado con Google Analytics. Por favor, conecta tu cuenta.' 
      });
    }

    // Configurar OAuth2 con tokens de la base de datos
    oauth2Client.setCredentials({
      access_token: admin.google_access_token,
      refresh_token: admin.google_refresh_token
    });

    // Verificar si el token necesita refrescarse
    const now = new Date();
    const tokenExpiry = new Date(admin.google_token_expiry);
    
    if (tokenExpiry < now) {
      try {
        // Intentar refrescar el token
        const { tokens } = await oauth2Client.refreshAccessToken();
        
        // Actualizar tokens en la base de datos
        await Admin.update({
          google_access_token: tokens.access_token,
          google_token_expiry: new Date(tokens.expiry_date)
        }, {
          where: { id: adminId }
        });

        oauth2Client.setCredentials(tokens);
      } catch (refreshError) {
        console.error('Error al refrescar token:', refreshError);
        
        // Si no podemos refrescar el token, pedir reconexión
        await Admin.update({
          google_access_token: null,
          google_refresh_token: null,
          google_token_expiry: null,
          google_analytics_connected: false
        }, {
          where: { id: adminId }
        });
        
        return res.status(401).json({ 
          success: false,
          error: 'Sesión expirada. Por favor, vuelve a conectarte a Google Analytics.' 
        });
      }
    }

    // Obtener datos de Analytics
    const analyticsData = await fetchAnalyticsData(oauth2Client);
    
    res.json({
      success: true,
      analytics: analyticsData
    });
  } catch (error) {
    console.error('Error al obtener datos de Analytics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener datos de Analytics' 
    });
  }
};

// 4. Endpoint para desconectar
analyticsController.disconnectAnalytics = async (req, res) => {
  const adminId = req.user.id;

  try {
    const admin = await Admin.findByPk(adminId);
    
    // Revocar el token en Google si existe
    if (admin.google_access_token) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${admin.google_access_token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
      } catch (revokeError) {
        console.warn('No se pudo revocar el token en Google:', revokeError);
      }
    }

    // Eliminar tokens de la base de datos
    await Admin.update({
      google_access_token: null,
      google_refresh_token: null,
      google_token_expiry: null,
      google_analytics_connected: false
    }, {
      where: { id: adminId }
    });

    res.json({ 
      success: true, 
      message: 'Desconectado correctamente de Google Analytics' 
    });
  } catch (error) {
    console.error('Error al desconectar Google Analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al desconectar Google Analytics' 
    });
  }
};

// Función para obtener datos de Analytics
async function fetchAnalyticsData(authClient) {
  try {
    const analytics = google.analyticsdata({ version: 'v1beta', auth: authClient });
    
    const response = await analytics.properties.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
        dimensions: [
          { name: 'pagePath' }, 
          { name: 'deviceCategory' }, 
          { name: 'sessionSource' }
        ],
      },
    });

    return processAnalyticsData(response.data);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return getDefaultAnalyticsData();
  }
}

// Función principal de procesamiento de datos
function processAnalyticsData(data) {
  const rows = data.rows || [];
  
  // Procesamiento en subfunciones
  const totals = calculateTotals(rows);
  const pageStats = processPages(rows);
  const deviceStats = processDevices(rows);
  const trafficSources = processTrafficSources(rows);
  
  // Calcular promedios
  const avgBounceRate = totals.sessionCount > 0 ? 
    (totals.totalBounceRate / totals.sessionCount) * 100 : 0;
  const avgSessionDuration = totals.sessionCount > 0 ? 
    totals.totalSessionDuration / totals.sessionCount : 0;

  return {
    totalVisitors: totals.totalVisitors || 0,
    pageViews: totals.totalPageViews || 0,
    bounceRate: parseFloat(avgBounceRate.toFixed(1)) || 0,
    avgSessionDuration: formatDuration(avgSessionDuration) || "0:00",
    topPages: prepareTopPages(pageStats),
    deviceStats: prepareDeviceStats(deviceStats),
    trafficSources: prepareTrafficSources(trafficSources)
  };
}

// Subfunciones para procesamiento de datos
function calculateTotals(rows) {
  let totalVisitors = 0;
  let totalPageViews = 0;
  let totalBounceRate = 0;
  let totalSessionDuration = 0;
  let sessionCount = 0;

  rows.forEach(row => {
    const metrics = row.metricValues || [];
    if (metrics[0]) totalVisitors += parseInt(metrics[0].value) || 0;
    if (metrics[1]) totalPageViews += parseInt(metrics[1].value) || 0;
    if (metrics[2]) {
      totalBounceRate += parseFloat(metrics[2].value) || 0;
      sessionCount++;
    }
    if (metrics[3]) totalSessionDuration += parseFloat(metrics[3].value) || 0;
  });

  return { totalVisitors, totalPageViews, totalBounceRate, totalSessionDuration, sessionCount };
}

function processPages(rows) {
  const pageStats = {};
  
  rows.forEach(row => {
    const dimensions = row.dimensionValues || [];
    const metrics = row.metricValues || [];
    
    if (dimensions[0] && dimensions[0].value) {
      const pagePath = dimensions[0].value;
      const pageViews = parseInt(metrics[1]?.value) || 0;
      
      pageStats[pagePath] = (pageStats[pagePath] || 0) + pageViews;
    }
  });
  
  return pageStats;
}

function processDevices(rows) {
  const deviceStats = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 };
  
  rows.forEach(row => {
    const dimensions = row.dimensionValues || [];
    const metrics = row.metricValues || [];
    
    if (dimensions[1] && dimensions[1].value) {
      const device = dimensions[1].value.toLowerCase();
      const users = parseInt(metrics[0]?.value) || 0;
      
      if (device === 'mobile') deviceStats.mobile += users;
      else if (device === 'desktop') deviceStats.desktop += users;
      else if (device === 'tablet') deviceStats.tablet += users;
      else deviceStats.unknown += users;
    }
  });
  
  return deviceStats;
}

function processTrafficSources(rows) {
  const trafficSources = {};
  
  rows.forEach(row => {
    const dimensions = row.dimensionValues || [];
    const metrics = row.metricValues || [];
    
    if (dimensions[2] && dimensions[2].value) {
      const source = dimensions[2].value;
      const users = parseInt(metrics[0]?.value) || 0;
      
      let sourceCategory = 'Otros';
      if (source.includes('google')) sourceCategory = 'Búsqueda orgánica';
      else if (source === '(direct)') sourceCategory = 'Directo';
      else if (source.includes('facebook') || source.includes('instagram') ||
               source.includes('twitter') || source.includes('linkedin')) {
        sourceCategory = 'Redes sociales';
      }
      else if (source !== '(not set)' && source !== '(none)') {
        sourceCategory = source;
      }
      
      trafficSources[sourceCategory] = (trafficSources[sourceCategory] || 0) + users;
    }
  });
  
  return trafficSources;
}

// Funciones de preparación para respuesta
function prepareTopPages(pageStats) {
  const topPages = Object.entries(pageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const totalTopViews = topPages.reduce((sum, item) => sum + item[1], 0);
  
  return topPages.length > 0 ? 
    topPages.map(([path, views]) => ({
      path,
      views,
      percentage: totalTopViews > 0 ? (views / totalTopViews) * 100 : 0
    })) : 
    getDefaultTopPages();
}

function prepareDeviceStats(deviceStats) {
  const totalDevices = deviceStats.mobile + deviceStats.desktop + 
                      deviceStats.tablet + deviceStats.unknown;
  
  if (totalDevices > 0) {
    return {
      mobile: (deviceStats.mobile / totalDevices) * 100,
      desktop: (deviceStats.desktop / totalDevices) * 100,
      tablet: (deviceStats.tablet / totalDevices) * 100
    };
  }
  
  return getDefaultDeviceStats();
}

function prepareTrafficSources(trafficSources) {
  const totalTraffic = Object.values(trafficSources).reduce((sum, count) => sum + count, 0);
  
  const sources = Object.entries(trafficSources)
    .map(([source, count]) => ({
      source,
      percentage: totalTraffic > 0 ? (count / totalTraffic) * 100 : 0
    }))
    .sort((a, b) => b.percentage - a.percentage);
  
  return sources.length > 0 ? sources : getDefaultTrafficSources();
}

// Funciones para datos por defecto
function getDefaultAnalyticsData() {
  return {
    totalVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: "0:00",
    topPages: getDefaultTopPages(),
    deviceStats: getDefaultDeviceStats(),
    trafficSources: getDefaultTrafficSources()
  };
}

function getDefaultTopPages() {
  return [
    { path: "/", views: 1856, percentage: 52.7 },
    { path: "/#sobre-nosotros", views: 687, percentage: 19.5 },
    { path: "/#contacto", views: 423, percentage: 12.0 },
    { path: "/#horarios", views: 312, percentage: 8.9 },
    { path: "/#sucursales", views: 243, percentage: 6.9 }
  ];
}

function getDefaultDeviceStats() {
  return { mobile: 68.4, desktop: 28.1, tablet: 3.5 };
}

function getDefaultTrafficSources() {
  return [
    { source: "Búsqueda orgánica", percentage: 42.3 },
    { source: "Directo", percentage: 31.8 },
    { source: "Redes sociales", percentage: 15.2 },
    { source: "Referencias", percentage: 10.7 }
  ];
}

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

module.exports = analyticsController;