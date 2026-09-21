export async function onRequestPost(context) {
  try {
    // Nhận dữ liệu từ trang web của bạn gửi lên
    const body = await context.request.json();
    
    // Cloudflare Pages server gọi hộ sang server hãng (né sạch CORS và OPTIONS)
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

    const data = await apiRes.json();
    
    // Trả kết quả về cho trang web của bạn kèm theo header ép buộc không cache
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
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
