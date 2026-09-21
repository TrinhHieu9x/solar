export async function onRequestPost(context) {
  try {
    // 1. Kiểm tra an toàn khi đọc JSON từ client gửi lên
    let body;
    try {
      body = await context.request.json();
    } catch (e) {
      return new Response(JSON.stringify({ success: false, message: "Payload gửi lên không phải JSON hợp lệ!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 2. Gọi sang server hãng
    const apiRes = await fetch("https://www.cloudinverter.net/dist/server/api/CodeIgniter/index.php/Senergytec/web/v2/Inverterapi/InverterDetailInfoNewone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": context.request.headers.get("Authorization") || "",
        "Origin": "https://www.cloudinverter.net",
        "Referer": "https://www.cloudinverter.net/dist/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*"
      },
      body: JSON.stringify(body)
    });

    const textRes = await apiRes.text();
    let data;
    try {
      data = JSON.parse(textRes);
    } catch (e) {
      // Nếu hãng trả về HTML hoặc lỗi không phải JSON
      return new Response(JSON.stringify({ success: false, message: "Hãng trả về dữ liệu lỗi: " + textRes }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 3. Trả kết quả thành công về cho trang web
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });

  } catch (err) {
    // 🛑 TRẢ VỀ CHI TIẾT LỖI RA RESPONSE ĐỂ DỄ ĐỌC TRÊN TRÌNH DUYỆT
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message, 
      stack: err.stack 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
