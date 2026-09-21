export async function onRequestPost(context) {
  try {
    let body;
    try {
      body = await context.request.json();
    } catch (e) {
      return new Response(JSON.stringify({ success: false, message: "Payload không phải JSON hợp lệ!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Lấy Authorization và Cookie từ client gửi lên
    const authHeader = context.request.headers.get("Authorization") || "";
    const cookieHeader = context.request.headers.get("Cookie") || "";

    // Gọi sang server hãng kèm theo Cookie đầy đủ
    const apiRes = await fetch("https://www.cloudinverter.net/dist/server/api/CodeIgniter/index.php/Senergytec/web/v2/Inverterapi/InverterDetailInfoNewone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
        "Cookie": cookieHeader, // 🛑 Bổ sung chuyển tiếp Cookie sang hãng tại đây!
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
      return new Response(JSON.stringify({ success: false, message: "Hãng trả về dữ liệu lỗi: " + textRes }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
    
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
    return new Response(JSON.stringify({ success: false, error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
