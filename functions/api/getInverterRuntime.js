async function fetchVendorAPINew(endpoint = "getInvRealtimeData_v1") {
  const base = "https://www.cloudinverter.net/dist/server/api/test/CodeIgniter/index.php/version3/v2/Inverterapi";
  const url = `${base}/${endpoint}`;

  // 1. Dữ liệu chuẩn (Fix cứng theo bản gốc của bạn để debug)
  const autoId = "274913";
  const memberAutoId = "466440";
  const modbusList = ["1A18","1A44","1A45","1A46","1A4E","214C","2143"];
  //const modbusList = ["1A18","1A44","1A45","1A46","1A4E","214C","2143"];
  
  // Đây là chữ ký "xịn" bạn đưa - dùng cái này chắc chắn có data
  //const signGoc = "eZkI9tfKucKsr89Lt6cp2CMQ4Lb4NetIR/PIe2sY6U1G5DAZzFVMuaGoAxro+m4WP3xVCQfYTm6/lTSHCuvHD9HjlvjT+2IMWski1Pd+7oxXphb+eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuY2xvdWRpbnZlcnRlci5uZXQiLCJhdWQiOiJ3d3cuY2xvdWRpbnZlcnRlci5uZXQiLCJpYXQiOjE3ODk4Mjg2NjAsIm5iZiI6MTc4OTgyODY2MCwiZXhwIjoxODIwOTMyNjYwLCJkYXRhIjp7Ik1lbWJlckF1dG9JRCI6bnVsbH19.UANBzSlAw2-NkvO4_B4My4uVbDxdfFnrD_xpw7FmMCU";

  // 2. Thử tạo chữ ký mới bằng hàm tự động để so sánh
  const payloadForSign = {
    AutoId: autoId,
    memberAutoID: memberAutoId,
    ModbusArr: modbusList
  };

  const signResult = await createSign(payloadForSign);
  const signMoi = signResult.base64;

  // 3. LOG ĐỐI SOÁT - Xem trong console của Cloudflare Workers
  console.log("========== DEBUG SIGN ==========");
  console.log("Canonical String dùng mã hóa:", signResult.raw);
  //console.log("Sign Gốc (Xịn):", signGoc);
  console.log("Sign Mới (Tự tạo):", signMoi);
  
  //if (signGoc === signMoi) {
   // console.log("✅ KẾT QUẢ: Hai chuỗi khớp nhau!");
  //} else {
  //  console.log("❌ KẾT QUẢ: Chữ ký tự tạo đang bị lệch!");
  //}
  //console.log("================================");

  // 4. Gửi Request (Tạm thời dùng signGoc để bạn có data ngay lập tức)
  const formData = new FormData();
  formData.append("AutoId", autoId);
  formData.append("memberAutoID", memberAutoId);
  formData.append("ModbusArr", JSON.stringify(modbusList));
  formData.append("sign", signMoi); // Đổi thành signMoi sau khi log đã khớp

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuY2xvdWRpbnZlcnRlci5uZXQiLCJhdWQiOiJ3d3cuY2xvdWRpbnZlcnRlci5uZXQiLCJpYXQiOjE3ODk3NDUzODIsIm5iZiI6MTc4OTc0NTM4MiwiZXhwIjoxODIwODQ5MzgyLCJkYXRhIjp7Ik1lbWJlckF1dG9JRCI6bnVsbH19.I1lVXapYfMnM1-7hX4gdsF7MoEoZ5y-xCYRc2XGJWN1",
        "Accept": "application/json"
      },
      body: formData
    });

    return await res.json();
  } catch (err) {
    return { error: true, message: err.toString() };
  }
}
