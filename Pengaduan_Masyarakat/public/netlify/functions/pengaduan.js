// Netlify Function untuk menangani pengaduan
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Generate tracking number
  function generateTrackingNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ADU-${year}-${randomNum}`;
  }

  // Handle POST request
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      
      // Validasi data
      if (!data.nama || !data.email || !data.judul) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Data tidak lengkap'
          })
        };
      }

      const trackingNumber = generateTrackingNumber();
      
      // Simpan data (dalam contoh ini hanya mengembalikan tracking number)
      // Di produksi, simpan ke database
      const complaintData = {
        id: Date.now(),
        trackingNumber,
        ...data,
        tanggal: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Pengaduan berhasil diterima',
          trackingNumber,
          data: complaintData
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Terjadi kesalahan server',
          error: error.message
        })
      };
    }
  }

  // Handle GET request (untuk tracking)
  if (event.httpMethod === 'GET') {
    const trackingNumber = event.queryStringParameters.trackingNumber;
    
    if (!trackingNumber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Nomor tracking diperlukan'
        })
      };
    }

    // Di produksi, ambil dari database
    // Contoh data statis
    const exampleData = {
      trackingNumber: trackingNumber,
      judul: "Contoh Pengaduan",
      status: "pending",
      tanggal: "2023-10-25",
      response: "Pengaduan sedang dalam proses"
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: exampleData
      })
    };
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      success: false,
      message: 'Method tidak diizinkan'
    })
  };
};