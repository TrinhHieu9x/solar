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
        "Referer": "https://www.cloudinverter.net/dist/"
      },
      body: JSON.stringify(body)
    });

    const data = await apiRes.json();
    
    // Trả kết quả về cho trang web của bạn
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
