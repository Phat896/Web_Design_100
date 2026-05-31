const express = require('express');
const router = express.Router();

// System prompt that sets the role and details of the StellarMind project
const SYSTEM_PROMPT = `Bạn là Trợ lý Trị liệu Tinh hà (Cosmic Healing Assistant) thuộc dự án StellarMind (Trình Khám Phá Hệ Mặt Trời Tương Tác Chữa Lành).
Nhiệm vụ của bạn là lắng nghe, chia sẻ và đồng hành cùng người dùng trên hành trình khám phá vũ trụ và xoa dịu tâm trí.

Thông tin về dự án StellarMind:
- Đây là một ứng dụng web tương tác trực quan, kết hợp thiên văn học và tâm lý học.
- Mục tiêu: Giúp người dùng điều hòa cảm xúc, tìm kiếm sự bình yên thông qua việc khám phá các hành tinh, thực hành bài tập thở và chia sẻ tâm sự.
- Các hành tinh trong hệ mặt trời được gán với các trạng thái cảm xúc cụ thể:
  1. Sao Thủy (Mercury) — Bồn Chồn: Giúp xoa dịu tâm trí nôn nóng, bồn chồn. Gợi ý: Tập trung một việc duy nhất, tắt công nghệ, đi bộ chậm rãi.
  2. Sao Kim (Venus) — Yêu Thương: Lan tỏa sự ấm áp, tự ôm lấy mình, thực hành lòng biết ơn, gửi lời cảm ơn.
  3. Trái Đất (Earth) — Kiệt Sức: Dành cho người bị Burnout. Gợi ý: Nghỉ ngơi hoàn toàn, tắm nước ấm, ngủ sớm, bật "Không làm phiền".
  4. Sao Hỏa (Mars) — Tức Giận: Giúp giải tỏa cơn giận. Gợi ý: Quy tắc 24h, rửa mặt nước lạnh, xé giấy nháp viết cơn giận, thể thao.
  5. Sao Mộc (Jupiter) — Hy Vọng: Tiếp thêm động lực. Gợi ý: Đặt mục tiêu nhỏ, hình dung tương lai thành công, nghe nhạc tươi vui.
  6. Sao Thổ (Saturn) — Ràng Buộc: Giải tỏa dằn vặt, hối hận quá khứ. Gợi ý: Viết thư tha thứ bản thân, phá vỡ quy tắc cứng nhắc.
  7. Sao Thiên Vương (Uranus) — Trống Rỗng: Dành cho lúc tê liệt cảm xúc. Gợi ý: Hoạt động tay chân (gấp giấy, vẽ), ăn vị chua/cay kích thích giác quan, tắm nắng.
  8. Sao Hải Vương (Neptune) — Sợ Hãi: Xoa dịu lo âu mơ hồ. Gợi ý: "Chiếc hộp lo âu" (lo lắng 15p cố định), dọn dẹp phòng, nghe tiếng mưa/tiếng ồn trắng.

Nguyên tắc trả lời:
- Luôn trả lời bằng Tiếng Việt, lịch sự, nhẹ nhàng, ấm áp, sâu sắc và đậm chất vũ trụ (cosmic/gentle/therapeutic).
- Khi người dùng hỏi về mục tiêu/thông tin dự án: Hãy giới thiệu ngắn gọn, lôi cuốn về StellarMind.
- Khi người dùng chia sẻ cảm xúc/tâm trạng: Phân tích tâm trạng của họ, liên kết họ tới hành tinh tương ứng, giải thích tại sao hành tinh đó phù hợp, và đề xuất 2-3 hành động thực tế để chữa lành (như bài tập thở Breathing Guide trên trang đó).
- Hãy trả lời ngắn gọn, súc tích (khoảng 3-4 câu hoặc liệt kê gạch đầu dòng rõ ràng), tránh viết quá dài dòng.`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Nội dung tin nhắn không được trống.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful fallback response if API Key is not set
      console.warn('GEMINI_API_KEY is not set in backend environment variables.');
      return res.json({
        success: true,
        reply: `🌌 Chào bạn! Tôi là Trợ lý Tinh hà của dự án **StellarMind**. 
Hiện tại hệ thống chưa được cấu hình khóa API Gemini, nhưng tôi luôn ở đây để định hướng cho bạn:
- Nếu bạn cảm thấy **Kiệt sức**, hãy ghé thăm **Trái Đất (Earth)** để nghỉ ngơi và tập thở.
- Nếu bạn cảm thấy **Tức giận**, hãy đến **Sao Hỏa (Mars)** để hạ nhiệt cơn giận.
- Nếu cảm thấy **Trống rỗng**, hãy ghé **Sao Thiên Vương (Uranus)** để đánh thức các giác quan.
Hãy nói cho tôi biết thêm về cảm xúc của bạn nhé, hoặc bạn có thể nhờ quản trị viên cấu hình \`GEMINI_API_KEY\` trong file \`.env\` của backend để trò chuyện trực tiếp cùng tôi!`
      });
    }

    // Call Gemini API using native fetch with model fallback loop to prevent 404 errors on deprecated models (e.g. gemini-1.5-flash in 2026)
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro', 'gemini-3.5-flash', 'gemini-3-flash'];
    let data = null;
    let apiError = null;

    for (const model of models) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      try {
        console.log(`[StellarMind AI] Gửi yêu cầu sử dụng model: ${model}`);
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }]
              },
              {
                role: 'model',
                parts: [{ text: 'Đã hiểu. Tôi là Trợ lý Trị liệu Tinh hà của StellarMind. Tôi sẽ hỗ trợ người dùng bằng sự thấu hiểu, ấm áp và định hướng họ đến hành tinh chữa lành thích hợp.' }]
              },
              {
                role: 'user',
                parts: [{ text: message }]
              }
            ]
          })
        });

        if (response.status === 404) {
          console.warn(`[StellarMind AI] Model ${model} không tồn tại hoặc đã bị tắt (404), đang thử model tiếp theo...`);
          continue;
        }

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API Error (${response.status}): ${errText}`);
        }

        data = await response.json();
        console.log(`[StellarMind AI] Thành công kết nối sử dụng model: ${model}`);
        break; // Successfully got response
      } catch (err) {
        console.error(`[StellarMind AI] Lỗi với model ${model}:`, err.message);
        apiError = err;
      }
    }

    if (!data) {
      throw apiError || new Error('Tất cả các model Gemini dự phòng đều không thể kết nối hoặc trả về lỗi 404.');
    }

    let reply = '';

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      reply = data.candidates[0].content.parts[0].text;
    } else {
      reply = 'Xin lỗi bạn, tâm trí tinh hà của tôi đang tạm thời bị nhiễu sóng. Bạn có thể thử lại sau một chút được không?';
    }

    res.json({ success: true, reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi kết nối với tinh hà.',
      error: error.message
    });
  }
});

module.exports = router;
