export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    
    // Tạo FormData để ép kiểu dữ liệu gửi sang hãng y hệt như cách 2 của bạn
    const formData = new URLSearchParams();
    formData.append("AutoId", body.AutoId || "");
    formData.append("memberAutoID", body.MemberAutoID || "");
    formData.append("ModbusArr", JSON.stringify(body.modbusList || body.ModbusArr || []));
    formData.append("sign", body.sign || "");

    const authHeader = context.request.headers.get("Authorization") || "";
    const cookieHeader = context.request.headers.get("Cookie") || "timezone=Asia%2FBangkok";
    
    const apiRes = await fetch("https://www.cloudinverter.net/dist/server/api/test/CodeIgniter/index.php/version3/v2/Inverterapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Chuẩn form dữ liệu PHP cực kỳ thích
        "Authorization": authHeader,
        "Cookie": cookieHeader,
        "Origin": "https://www.cloudinverter.net",
        "Referer": "https://www.cloudinverter.net/dist/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: formData.toString()
    });

    const data = await apiRes.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" 
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
