/* ============================================================
   PLANETS ENHANCED — Additive JS Module v1.0
   Non-destructive: uses MutationObserver on existing elements.
   Does NOT touch app.js logic, render loop, or canvas engine.
   ============================================================ */

'use strict';

// ─────────────────────────────────────
//  PLANET EMOTIONAL CONTENT DATA
// ─────────────────────────────────────
const EP_DATA = {
  mercury: {
    emotion: 'Bồn Chồn',
    themeClass: 'planet-theme-mercury',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_51527ab0d3.mp3?filename=rain-and-thunder-113218.mp3',
    youtubeLinks: [
      { title: 'Thiền 10 Phút Giảm Bồn Chồn (The Present Writer)', url: 'https://www.youtube.com/watch?v=inpok4MKVLM' },
      { title: 'Nhạc Tần Số 432Hz Chữa Lành Tế Bào', url: 'https://www.youtube.com/watch?v=1zxjCGDPUKM' }
    ],
    quotes: [
      'Sự nôn nóng không làm thời gian trôi nhanh hơn, nó chỉ đánh cắp hiện tại của bạn.',
      'Đừng cố chạy đua với thời gian khi bạn chưa biết mình đang đi đâu.',
      'Sự tĩnh lặng đôi khi là hành động mạnh mẽ nhất.',
      'Hít thở. Mọi thứ đều cần thời gian để nở hoa.',
    ],
    symptoms: [
      'Nhịp tim nhanh hơn bình thường, không thể ngồi yên một chỗ quá lâu',
      'Liên tục kiểm tra điện thoại hoặc đồng hồ, luôn cảm thấy thiếu thời gian',
      'Dễ cáu gắt khi mọi việc không theo ý muốn ngay lập tức',
    ],
    causes: [
      'Áp lực phải đạt được thành tựu nhanh chóng',
      'Tiêu thụ quá nhiều caffeine hoặc nội dung số ngắn (Short-form content)',
      'Cảm giác sợ bị bỏ lỡ (FOMO)',
    ],
    advice: [
      'Tập trung vào "một việc duy nhất" tại một thời điểm (Single-tasking)',
      'Thiết lập "vùng không công nghệ" trong 1 giờ mỗi ngày',
      'Chấp nhận rằng có những thứ vượt ngoài tầm kiểm soát của bạn',
    ],
    actions: [
      { step: 1, text: 'Tắt điện thoại và úp mặt nó xuống bàn trong 15 phút' },
      { step: 2, text: 'Viết ra giấy 3 việc quan trọng nhất hôm nay và bỏ qua phần còn lại' },
      { step: 3, text: 'Đi bộ chậm rãi, đếm từng bước chân' },
    ],
    aiResponses: [
      'Bạn đang vội vã đi đâu vậy? Hãy dừng lại một chút, hít thở và cảm nhận khoảnh khắc này nhé.',
      'Tôi hiểu cảm giác muốn mọi thứ nhanh hơn. Nhưng hãy nhớ rằng, những điều tốt đẹp cần thời gian để nở hoa.',
    ],
  },

  venus: {
    emotion: 'Yêu Thương',
    themeClass: 'planet-theme-venus',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=birds-singing-calm-river-nature-ambient-sound-12508.mp3',
    youtubeLinks: [
      { title: 'Ngôn Ngữ Tình Yêu Của Bạn Là Gì? (Psych2Go)', url: 'https://www.youtube.com/watch?v=1zxjCGDPUKM' },
      { title: 'Nhạc Tần Số 528Hz Thu Hút Năng Lượng Tích Cực', url: 'https://www.youtube.com/watch?v=mPZkdNFkNps' }
    ],
    quotes: [
      'Tình yêu thương lớn nhất bắt đầu từ việc học cách yêu lấy chính mình.',
      'Khi bạn cho đi sự chân thành, vũ trụ sẽ phản hồi bằng sự bình yên.',
      'Không gian ấm áp nhất không nằm ở một ngôi nhà, mà nằm ở một trái tim.',
      'Sự dịu dàng là sức mạnh lớn nhất mà con người sở hữu.',
    ],
    symptoms: [
      'Nhịp tim ổn định, lồng ngực mở rộng, hơi thở sâu và đều đặn',
      'Cảm giác muốn kết nối, chia sẻ và mỉm cười vô cớ với mọi người',
      'Nhìn nhận khuyết điểm của người khác bằng sự bao dung và cảm thông',
    ],
    causes: [
      'Nhận được sự công nhận và thấu hiểu từ những người quan trọng',
      'Thực hành lòng biết ơnmỗi ngày',
      'Được sống đúng với bản ngã và những giá trị cốt lõi của bản thân',
    ],
    advice: [
      'Hãy thể hiện sự trân trọng ra bằng lời nói, đừng chỉ giữ trong lòng',
      'Tự thưởng cho bản thân một ngày nghỉ ngơi trọn vẹn',
      'Tiếp tục lan tỏa tần số này bằng một hành động tử tế nhỏ gọn',
    ],
    actions: [
      { step: 1, text: 'Gửi một tin nhắn cảm ơn ngắn đến người đã giúp đỡ bạn gần đây' },
      { step: 2, text: 'Tự ôm lấy chính mình trong 30 giây' },
      { step: 3, text: 'Viết ra 3 điều khiến bạn cảm thấy may mắn trong hôm nay' },
    ],
    aiResponses: [
      'Tần số sóng não của bạn đang rất hài hòa. Hãy trân trọng khoảnh khắc ấm áp này nhé.',
      'Yêu thương đang lan tỏa từ bạn. Năng lượng của bạn đang sưởi ấm cả không gian xung quanh.',
    ],
  },

  earth: {
    emotion: 'Kiệt Sức',
    themeClass: 'planet-theme-earth',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=birds-singing-calm-river-nature-ambient-sound-12508.mp3',
    youtubeLinks: [
      { title: 'Hiểu Về Burnout Và Cách Phục Hồi (TEDx)', url: 'https://www.youtube.com/watch?v=hFkI69zJzLI' },
      { title: 'Nhạc Không Lời Giúp Lấy Lại Năng Lượng', url: 'https://www.youtube.com/watch?v=2OEL4P1Rz04' }
    ],
    quotes: [
      'Bạn không phải là một cỗ máy. Nghỉ ngơi không phải là một tội lỗi.',
      'Tắt nguồn để sạc lại. Cả điện thoại và bạn đều cần điều đó.',
      'Đôi khi, thành tựu lớn nhất trong ngày là việc bạn đã sống sót qua nó.',
      'Đừng đốt cháy chính mình để sưởi ấm cho người khác.',
    ],
    symptoms: [
      'Mất động lực hoàn toàn vào buổi sáng khi thức dậy, không muốn làm bất cứ việc gì',
      'Cảm thấy trống rỗng và xa lánh ngay giữa gia đình hoặc đồng nghiệp',
      'Phản ứng cáu gắt bất thường với những việc nhỏ nhặt nhất',
    ],
    causes: [
      'Khối lượng công việc quá tải kéo dài',
      'Thiếu sự công nhận và phần thưởng xứng đáng',
      'Áp lực xã hội (Đồng trang lứa, gia đình) không ngừng nghỉ',
    ],
    advice: [
      'Tạm dừng mọi thứ không khẩn cấp. Ưu tiên số một lúc này là nghỉ ngơi.',
      'Sử dụng ngày nghỉ phép một cách thực sự (không check email/tin nhắn công việc)',
      'Nhận ra rằng thế giới vẫn quay dù bạn có tạm dừng lại vài ngày',
    ],
    actions: [
      { step: 1, text: 'Hủy bỏ ít nhất 1 cuộc hẹn không cần thiết trong tuần này' },
      { step: 2, text: 'Tắm nước ấm và đi ngủ sớm hơn bình thường 1 tiếng' },
      { step: 3, text: 'Bật chế độ "Không làm phiền" (Do Not Disturb) trên điện thoại' },
    ],
    aiResponses: [
      'Bạn đã làm đủ tốt rồi. Hôm nay, hãy cho phép bản thân được nghỉ ngơi thật sự nhé.',
      'Mức năng lượng của bạn đang rất thấp. Hãy ưu tiên chăm sóc bản thân trước mọi thứ khác.',
    ],
  },

  mars: {
    emotion: 'Tức Giận',
    themeClass: 'planet-theme-mars',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_031f0cf2f7.mp3?filename=brown-noise-16168.mp3',
    youtubeLinks: [
      { title: 'Kiểm Soát Cơn Giận Bằng Tâm Lý Học', url: 'https://www.youtube.com/watch?v=BsVq5R_F6RA' },
      { title: 'Tiếng Ồn Nâu (Brown Noise) Làm Dịu Tâm Trí', url: 'https://www.youtube.com/watch?v=hXrtQcMcZJU' }
    ],
    quotes: [
      'Tức giận là tín hiệu — hãy lắng nghe, đừng để nó kiểm soát bạn.',
      'Cơn giận đốt cháy người giữ nó lâu nhất.',
      'Khoảng cách 3 giây trước khi phản ứng có thể cứu vãn một mối quan hệ.',
      'Bình tĩnh không phải là yếu đuối — đó là sự kiểm soát tối cao.',
    ],
    symptoms: [
      'Tim đập mạnh, cơ bắp căng cứng, nắm chặt tay vô thức',
      'Xung động muốn phá hủy hoặc hét lớn một cách khó kiểm soát',
      'Suy nghĩ lặp đi lặp lại về việc bị đối xử bất công hoặc bị phản bội',
    ],
    causes: [
      'Cảm thấy không được tôn trọng, bị phản bội hoặc bị oan',
      'Tích tụ những căng thẳng nhỏ nhặt trong thời gian dài (Hiệu ứng giọt nước tràn ly)',
      'Ranh giới cá nhân bị vi phạm một cách trắng trợn',
    ],
    advice: [
      'Áp dụng "Quy tắc 24 giờ": Không đưa ra quyết định khi đang tức giận',
      'Sử dụng ngôn ngữ "Tôi" thay vì "Bạn" khi tranh luận (Ví dụ: "Tôi cảm thấy bị tổn thương khi...")',
      'Giải phóng năng lượng vật lý thông qua thể thao cường độ cao',
    ],
    actions: [
      { step: 1, text: 'Rút khỏi tình huống giao tiếp hiện tại ngay lập tức (Time-out)' },
      { step: 2, text: 'Rửa mặt bằng nước lạnh để giảm nhiệt độ cơ thể và kích hoạt dây thần kinh phế vị' },
      { step: 3, text: 'Viết tất cả sự tức giận ra nháp, sau đó xé bỏ nó' },
    ],
    aiResponses: [
      'Tôi đang lắng nghe cơn giận của bạn. Hãy nói ra ở đây, mọi thứ sẽ được giữ an toàn.',
      'Nhiệt độ cảm xúc của bạn đang rất cao. Hãy thử hít thở sâu vài nhịp để hạ nhiệt nhé.',
    ],
  },

  jupiter: {
    emotion: 'Hy Vọng',
    themeClass: 'planet-theme-jupiter',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf584.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    youtubeLinks: [
      { title: 'Sức Mạnh Của Sự Lạc Quan (TEDx)', url: 'https://www.youtube.com/watch?v=FjI5o25mN_E' },
      { title: 'Nhạc Thiền Sóng Não Alpha Khơi Dậy Cảm Hứng', url: 'https://www.youtube.com/watch?v=8ZgZ_8xRtzI' }
    ],
    quotes: [
      'Hy vọng không phải là mù quáng, mà là niềm tin rằng tương lai nằm trong tay bạn.',
      'Ngay cả trong đêm đen nhất, ánh sáng từ các vì sao vẫn đang du hành đến chỗ bạn.',
      'Ngày mai luôn mang theo một cơ hội mới, chỉ cần bạn chịu mở cửa đón nó.',
      'Sự rộng lớn của vũ trụ không nói lên sự nhỏ bé của bạn, mà nói lên tiềm năng vô hạn của bạn.',
    ],
    symptoms: [
      'Mắt sáng, cơ bắp linh hoạt, tràn đầy năng lượng vào mỗi buổi sáng',
      'Nhìn thấy giải pháp thay vì tập trung vào khó khăn',
      'Luồng suy nghĩ mạch lạc, tự tin hướng tới mục tiêu tương lai',
    ],
    causes: [
      'Đạt được một bước tiến nhỏ trong mục tiêu dài hạn',
      'Được truyền cảm hứng từ một câu chuyện, cuốn sách hoặc một người cố vấn',
      'Nhận ra rằng khó khăn hiện tại chỉ là một chặng đường mang tính tạm thời',
    ],
    advice: [
      'Chia nhỏ mục tiêu lớn thành các bước cực kỳ nhỏ để duy trì động lực này',
      'Ghi chép lại cảm giác tuyệt vời này để đọc lại vào những ngày "giông bão"',
      'Chia sẻ năng lượng này với những người đang cần một chút ánh sáng',
    ],
    actions: [
      { step: 1, text: 'Vạch ra 1 hành động nhỏ nhất có thể làm ngay hôm nay cho ước mơ của bạn' },
      { step: 2, text: 'Tưởng tượng chi tiết về phiên bản thành công nhất của bạn trong 5 năm tới' },
      { step: 3, text: 'Nghe một bản nhạc không lời mang âm hưởng hùng tráng, vui tươi' },
    ],
    aiResponses: [
      'Năng lượng của bạn đang rất rạng rỡ, cánh cửa tương lai đang mở rộng. Hãy giữ vững nhịp bước này.',
      'Tín hiệu tích cực rất mạnh! Hãy giữ vững tay lái, bạn đang đi đúng hướng.',
    ],
  },

  saturn: {
    emotion: 'Ràng Buộc',
    themeClass: 'planet-theme-saturn',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_51db0f19c6.mp3?filename=wind-howling-1-115372.mp3',
    youtubeLinks: [
      { title: 'Tại Sao Chấp Nhận Bản Thân Lại Khó Khăn?', url: 'https://www.youtube.com/watch?v=zR7T8O2XGhw' },
      { title: 'Nhạc Thư Giãn Giải Tỏa Cảm Giác Tội Lỗi', url: 'https://www.youtube.com/watch?v=V1bFr2SWP1I' }
    ],
    quotes: [
      'Quá khứ là một bài học, không phải là một nhà tù.',
      'Bạn không thể bắt đầu chương tiếp theo nếu cứ đọc mãi chương cũ.',
      'Tha thứ cho bản thân là bước đầu tiên để cởi bỏ xiềng xích.',
      'Sự hoàn hảo là một ảo ảnh. Hãy cho phép mình được sai lầm.',
    ],
    symptoms: [
      'Cảm giác dằn vặt dai dẳng về một sai lầm trong quá khứ, không thể buông bỏ',
      'Tự trừng phạt bản thân, tin rằng mình không xứng đáng có niềm vui',
      'Sợ tiến lên phía trước vì sợ lặp lại vòng lặp cũ',
    ],
    causes: [
      'Sống theo kỳ vọng quá mức của gia đình hoặc xã hội',
      'Những chấn thương tâm lý chưa được giải quyết',
      'Sự hối hận vì những lựa chọn không thể thay đổi',
    ],
    advice: [
      'Nhận thức rằng phiên bản quá khứ của bạn đã làm tốt nhất có thể với sự hiểu biết lúc đó',
      'Xác định những quy tắc/định kiến nào đang trói buộc bạn và tự hỏi: "Chúng có còn đúng không?"',
      'Trò chuyện với chuyên gia tâm lý nếu bóng ma quá khứ quá lớn',
    ],
    actions: [
      { step: 1, text: 'Viết một lá thư tha thứ cho chính phiên bản cũ của mình' },
      { step: 2, text: 'Xác định 1 "vành đai" (quy tắc cứng nhắc) bạn sẽ phá vỡ trong hôm nay' },
      { step: 3, text: 'Thực hành lòng từ bi với bản thân (Self-compassion) khi soi gương' },
    ],
    aiResponses: [
      'Bạn đang mang trên vai trọng lượng của những ngày cũ. Đã đến lúc nhẹ nhàng đặt nó xuống chưa?',
      'Phiên bản quá khứ của bạn đã làm tốt nhất có thể. Hãy tha thứ cho người đó nhé.',
    ],
  },

  uranus: {
    emotion: 'Trống Rỗng',
    themeClass: 'planet-theme-uranus',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_34dbd0b0ef.mp3?filename=space-ambience-124619.mp3',
    youtubeLinks: [
      { title: 'Cách Vượt Qua Sự Trống Rỗng (Sống Tỉnh Thức)', url: 'https://www.youtube.com/watch?v=7h2P4_H2o8c' },
      { title: 'Nhạc Không Gian Giúp Suy Nghĩ Tích Cực', url: 'https://www.youtube.com/watch?v=vV1pS7N6A_s' }
    ],
    quotes: [
      'Trống rỗng không có nghĩa là bạn đã hỏng. Đó là không gian chờ được lấp đầy.',
      'Bạn không cần phải cảm thấy vui vẻ mọi lúc. Cảm giác "tê liệt" cũng là một phản ứng bảo vệ.',
      'Lạc lối là một phần của việc tìm ra con đường mới.',
      'Đôi khi, tồn tại qua ngày hôm nay đã là một thành tựu.',
    ],
    symptoms: [
      'Cảm giác tê liệt cảm xúc, không buồn cũng không vui, mọi thứ đều nhạt nhòa',
      'Đặt câu hỏi "Mọi thứ có ý nghĩa gì?" một cách vô vọng và mệt mỏi',
      'Cắt đứt các kết nối xã hội vì không thấy hứng thú với bất cứ điều gì',
    ],
    causes: [
      'Bảo vệ bản thân sau một cú sốc tình cảm cực lớn (Disassociation)',
      'Mất định hướng nghề nghiệp hoặc khủng hoảng bản sắc cá nhân',
      'Thiếu vắng một mục đích sống (Purpose) rõ ràng kéo dài',
    ],
    advice: [
      'Đừng ép bản thân phải "cảm thấy" ngay lập tức. Hãy kiên nhẫn với sự trống rỗng này.',
      'Bắt đầu kết nối lại thông qua các giác quan vật lý (Hương vị, Âm thanh, Chạm)',
      'Tìm kiếm những niềm vui vi mô (Micro-joys) trong cuộc sống hàng ngày',
    ],
    actions: [
      { step: 1, text: 'Làm một việc đòi hỏi sự tập trung tay chân (Vẽ, nặn đất, gấp giấy)' },
      { step: 2, text: 'Ăn một món ăn có vị giác mạnh (chua, cay) để kích thích cảm giác' },
      { step: 3, text: 'Ngồi dưới ánh nắng mặt trời buổi sáng trong 15 phút' },
    ],
    aiResponses: [
      'Sự trống rỗng là một lời mời để xây dựng lại từ đầu. Hôm nay, bạn muốn bắt đầu từ đâu?',
      'Tôi không cần bạn phải cảm thấy gì cả lúc này. Chỉ cần bạn biết rằng bạn không đơn độc.',
    ],
  },

  neptune: {
    emotion: 'Sợ Hãi',
    themeClass: 'planet-theme-neptune',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ocean-waves-ambient-sound-12508.mp3',
    youtubeLinks: [
      { title: 'Hiểu Về Nỗi Lo Âu Và Panic Attack', url: 'https://www.youtube.com/watch?v=WWloIAQpMcQ' },
      { title: 'Tiếng Sóng Biển Thư Giãn (Deep Sleep)', url: 'https://www.youtube.com/watch?v=f77SKdyn-1Y' }
    ],
    quotes: [
      'Sợ hãi bóng tối không làm nó sáng lên, thắp một ngọn nến thì có.',
      'Bạn dũng cảm hơn bạn tưởng, và mạnh mẽ hơn bạn nghĩ.',
      'Phần lớn những điều ta sợ hãi đều không bao giờ xảy ra.',
      'Đừng để nỗi sợ tương lai đánh cắp hiện tại của bạn.',
    ],
    symptoms: [
      'Cảm giác lo âu mơ hồ không có đối tượng cụ thể, như một nỗi sợ lơ lừng',
      'Ám ảnh về tương lai bất định hoặc những thảm họa tưởng tượng không có thật',
      'Hay giật mình, cảnh giác cao độ và luôn ở trạng thái phòng thủ',
    ],
    causes: [
      'Thiếu thông tin hoặc mất kiểm soát về một sự kiện sắp diễn ra',
      'Tích tụ từ những trải nghiệm không an toàn trong quá khứ',
      'Đọc quá nhiều tin tức tiêu cực (Doomscrolling)',
    ],
    advice: [
      'Chấp nhận sự thật rằng "Không chắc chắn" (Uncertainty) là bản chất của cuộc sống',
      'Giới hạn thời gian tiêu thụ tin tức giật gân, bi kịch',
      'Tạo ra một thói quen (Routine) cố định hàng ngày để tạo cảm giác kiểm soát (An toàn)',
    ],
    actions: [
      { step: 1, text: 'Thực hiện bài tập "Chiếc hộp lo âu": Đặt giờ lo lắng cố định trong 15p mỗi ngày' },
      { step: 2, text: 'Dọn dẹp lại không gian làm việc hoặc phòng ngủ để lấy lại cảm giác kiểm soát' },
      { step: 3, text: 'Nghe âm thanh tiếng ồn trắng (White noise) hoặc tiếng mưa rơi' },
    ],
    aiResponses: [
      'Tôi đang ở đây với bạn. Bóng tối ngoài kia có thể rất lớn, nhưng bạn không đơn độc.',
      'Nỗi sợ của bạn hoàn toàn hợp lệ. Hãy cho phép mình được cảm thấy như vậy, rồi chúng ta sẽ tìm cách cùng nhau.',
    ],
  },
};

// ─────────────────────────────────────
//  SHARED FEELINGS MOCK DATA
// ─────────────────────────────────────
const EP_FEELINGS = [
  'Hôm nay tôi mệt mỏi nhưng cũng nhẹ nhõm hơn sau khi viết ra cảm xúc...',
  'Đang cố gắng từng ngày. Không dễ nhưng vẫn tiếp tục cố.',
  'Nghe nhạc và khóc một mình — đôi khi đó là cách tốt nhất để vơi.',
  'Tôi nhớ người đó nhưng biết rằng mình cần bước tiếp rồi.',
  'Hôm nay lần đầu trong tuần tôi mỉm cười thật sự với chính mình.',
  'Cảm thấy bị hiểu lầm nhiều quá. Nhưng rồi sẽ ổn thôi.',
  'Vẫn đang học cách tha thứ cho bản thân và cho người khác.',
  'Bầu trời đêm nay đẹp lắm. Thấy bình yên hơn một chút.',
  'Không cần mạnh mẽ mãi. Hôm nay cho phép bản thân nghỉ ngơi.',
  'Cảm ơn những người đã ở bên tôi trong ngày khó khăn nhất.',
];

const EP_PAGE_META = {
  mercury: {
    kicker: 'Trạng thái: Bồn chồn',
    path: 'Sao Thủy • Khoảng lặng của tâm trí',
    intro: 'Dữ liệu chỉ ra sự mất ổn định. Bạn không thể ngồi yên, cảm giác thời gian đang tuột khỏi tay.',
  },
  venus: {
    kicker: 'Trạng thái: Hài hòa',
    path: 'Sao Kim • Ánh sáng của yêu thương',
    intro: 'Tần số dao động đang ở mức lý tưởng. Năng lượng chữa lành đang lấp đầy không gian xung quanh bạn.',
  },
  earth: {
    kicker: 'Trạng thái: Kiệt sức',
    path: 'Trái Đất • Nơi cần được nghỉ ngơi',
    intro: 'Năng lượng của bạn đang ở mức rất thấp. Cơ thể và tâm trí đang cần được ngắt kết nối và phục hồi.',
  },
  mars: {
    kicker: 'Trạng thái: Tức giận',
    path: 'Sao Hỏa • Ngọn lửa bên trong',
    intro: 'Cảm xúc của bạn đang bùng nổ mạnh mẽ. Nếu không được xử lý, nó có thể gây tổn thương cho chính bạn và người xung quanh.',
  },
  jupiter: {
    kicker: 'Trạng thái: Hy vọng',
    path: 'Sao Mộc • Ánh sáng của tương lai',
    intro: 'Tầm nhìn của bạn đang quang đãng. Mọi giới hạn đang được phá vỡ bởi niềm tin và nghị lực.',
  },
  saturn: {
    kicker: 'Trạng thái: Ràng buộc',
    path: 'Sao Thổ • Xiềng xích của quá khứ',
    intro: 'Bạn đang mang theo trọng lượng của những sai lầm và hối tiếc. Đã đến lúc học cách buông bỏ.',
  },
  uranus: {
    kicker: 'Trạng thái: Trống rỗng',
    path: 'Sao Thiên Vương • Vùng đóng băng cảm xúc',
    intro: 'Cảm xúc của bạn đang ở trạng thái tê liệt. Đây là cơ chế tự bảo vệ của tâm trí khi quá tải.',
  },
  neptune: {
    kicker: 'Trạng thái: Sợ hãi',
    path: 'Sao Hải Vương • Vùng tối của nỗi sợ',
    intro: 'Những nỗi sợ vô hình đang bao trùm. Bạn cảm thấy mất phương hướng trong không gian bất định của cuộc sống.',
  },
};

// ─────────────────────────────────────
//  LOCAL STATE
// ─────────────────────────────────────
const epState = {
  currentPlanetId: null,
  activeTab: 'overview',
  breathingActive: false,
  breathTimer: null,
};

const BREATH_PHASES = [
  { name: 'Hít vào', cls: 'inhale', secs: 4 },
  { name: 'Giữ lại', cls: 'hold', secs: 4 },
  { name: 'Thở ra', cls: 'exhale', secs: 4 },
  { name: 'Nghỉ', cls: 'hold', secs: 2 },
];

let breathPhaseIdx = 0;
let breathCycleCount = 0;

// ─────────────────────────────────────
//  LOCALSTORAGE
// ─────────────────────────────────────
const LS_PLANET = 'ep_last_planet';
const LS_LEVEL = 'ep_emotion_level';

function epSave(planetId, level) {
  try {
    if (planetId !== undefined) localStorage.setItem(LS_PLANET, planetId);
    if (level !== undefined) localStorage.setItem(LS_LEVEL, String(level));
  } catch (_) { }
}

function epLoad() {
  try {
    return {
      planet: localStorage.getItem(LS_PLANET),
      level: localStorage.getItem(LS_LEVEL),
    };
  } catch (_) { return {}; }
}

// ─────────────────────────────────────
//  NAVBAR
// ─────────────────────────────────────
function epInitNavbar() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#' || !href || href.startsWith('#')) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  const closeBtn = document.getElementById('epPageClose');
  const panelClose = document.getElementById('panelClose');
  if (closeBtn && panelClose) {
    closeBtn.addEventListener('click', () => panelClose.click());
  }
}

function epSyncMenuIcon() {
  const source = document.getElementById('panelIcon');
  const target = document.getElementById('epMenuPlanetIcon');
  if (!source || !target) return;

  target.innerHTML = '';
  const canvas = source.querySelector('canvas');
  if (canvas) {
    target.appendChild(canvas.cloneNode(true));
    return;
  }

  const fallback = document.createElement('span');
  fallback.className = 'ep-menu-planet-fallback';
  fallback.textContent = (epState.currentPlanetId || '?').slice(0, 1).toUpperCase();
  target.appendChild(fallback);
}

// ─────────────────────────────────────
//  TAB SWITCHING
// ─────────────────────────────────────
function epSwitchTab(tabId) {
  epState.activeTab = tabId;
  const panel = document.getElementById('planetPanel');

  document.querySelectorAll('.ep-tab-btn').forEach(btn => {
    const sel = btn.dataset.tab === tabId;
    btn.classList.toggle('active', sel);
    btn.setAttribute('aria-selected', String(sel));
  });

  document.querySelectorAll('.ep-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.tab === tabId);
  });

  // overview tab → show existing panel-body; other tabs → hide it
  const panelBody = document.querySelector('#planetPanel .panel-body');
  if (panelBody) {
    panelBody.style.display = (tabId === 'overview') ? '' : 'none';
  }
  if (panel) panel.classList.toggle('ep-overview-active', tabId === 'overview');

  // stop breathing if leaving action tab
  if (tabId !== 'action' && epState.breathingActive) epStopBreath();
}

function epInitTabs() {
  document.querySelectorAll('.ep-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => epSwitchTab(btn.dataset.tab));
  });
}

// ─────────────────────────────────────
//  APPLY PLANET THEME
// ─────────────────────────────────────
function epApplyTheme(planetId) {
  const panel = document.getElementById('planetPanel');
  if (!panel) return;

  // remove all theme classes
  Object.values(EP_DATA).forEach(d => panel.classList.remove(d.themeClass));
  panel.classList.add('ep-enhanced');

  const data = EP_DATA[planetId];
  if (!data) return;
  const meta = EP_PAGE_META[planetId];

  panel.classList.add(data.themeClass);

  // random quote
  const quoteEl = document.getElementById('ep-quote');
  if (quoteEl) {
    quoteEl.textContent =
      data.quotes[Math.floor(Math.random() * data.quotes.length)];
  }

  // emotion label
  const emotionEl = document.getElementById('ep-emotion-label');
  if (emotionEl) emotionEl.textContent = data.emotion;

  const kickerEl = document.getElementById('epPageKicker');
  if (kickerEl && meta) kickerEl.textContent = meta.kicker;

  const pathEl = document.getElementById('epPagePath');
  if (pathEl && meta) pathEl.textContent = meta.path;

  const introEl = document.getElementById('epPageIntro');
  if (introEl && meta) introEl.textContent = meta.intro;

  epSyncMenuIcon();
}

// ─────────────────────────────────────
//  POPULATE TAB CONTENT
// ─────────────────────────────────────
function epPopulateTabs(planetId) {
  const data = EP_DATA[planetId];
  if (!data) return;

  epFillList('ep-symptoms-list', data.symptoms, '⚡');
  epFillList('ep-causes-list', data.causes, '🔍');
  epFillList('ep-advice-list', data.advice, '💡');
  epFillActions(data.actions);
}

function epFillList(id, items, icon) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.map(text =>
    `<li class="ep-list-item">
       <span class="ep-list-icon">${icon}</span>
       <span>${text}</span>
     </li>`
  ).join('');
}

function epFillActions(actions) {
  const el = document.getElementById('ep-actions-list');
  if (!el) return;
  el.innerHTML = actions.map(a =>
    `<div class="ep-action-step">
       <div class="ep-step-num">${a.step}</div>
       <span>${a.text}</span>
     </div>`
  ).join('');
}

// ─────────────────────────────────────
//  LOCALSTORAGE PERSONALIZATION
// ─────────────────────────────────────
function epRestoreVisit() {
  const { planet, level } = epLoad();
  if (!planet) return;

  const data = EP_DATA[planet];
  if (!data) return;

  // Show banner inside panel (will appear when panel opens)
  const banner = document.getElementById('ep-last-visit');
  if (banner) {
    const lvlTxt = level ? ` • mức ${level}/10` : '';
    banner.textContent = `Lần trước bạn ở trạng thái: ${data.emotion}${lvlTxt}`;
    banner.classList.add('visible');
  }

  // Highlight sidebar nav item — retry until sidebar is built
  const tryHighlight = () => {
    const navItem = document.getElementById(`nav-${planet}`);
    if (navItem) {
      navItem.classList.add('ep-last-visited');
    } else {
      setTimeout(tryHighlight, 400);
    }
  };
  tryHighlight();
}

// ─────────────────────────────────────
//  BREATHING GUIDE
// ─────────────────────────────────────
function epStartBreath() {
  if (epState.breathingActive) { epStopBreath(); return; }
  epState.breathingActive = true;
  breathPhaseIdx = 0;
  breathCycleCount = 0;

  const btn = document.getElementById('ep-breath-btn');
  if (btn) btn.textContent = 'DỪNG LẠI';

  epRunBreathPhase();
}

function epRunBreathPhase() {
  if (!epState.breathingActive) return;

  const phase = BREATH_PHASES[breathPhaseIdx];
  const circle = document.getElementById('ep-breath-circle');
  const label = document.getElementById('ep-breath-label');
  const timerEl = document.getElementById('ep-breath-timer');

  if (circle) { circle.className = `ep-breath-circle ${phase.cls}`; circle.textContent = phase.name; }
  if (label) label.textContent = phase.name;

  let secs = phase.secs;
  if (timerEl) timerEl.textContent = secs + 's';

  epState.breathTimer = setInterval(() => {
    secs -= 1;
    if (timerEl) timerEl.textContent = secs + 's';
    if (secs <= 0) {
      clearInterval(epState.breathTimer);
      breathPhaseIdx = (breathPhaseIdx + 1) % BREATH_PHASES.length;
      if (breathPhaseIdx === 0) {
        breathCycleCount++;
        if (breathCycleCount >= 4) { epStopBreath(); return; }
      }
      epRunBreathPhase();
    }
  }, 1000);
}

function epStopBreath() {
  epState.breathingActive = false;
  clearInterval(epState.breathTimer);

  const circle = document.getElementById('ep-breath-circle');
  const label = document.getElementById('ep-breath-label');
  const timerEl = document.getElementById('ep-breath-timer');
  const btn = document.getElementById('ep-breath-btn');

  if (circle) { circle.className = 'ep-breath-circle'; circle.textContent = '●'; }
  if (label) label.textContent = 'Nhấn bắt đầu';
  if (timerEl) timerEl.textContent = '—';
  if (btn) btn.textContent = 'BẮT ĐẦU';
}

function epInitBreathing() {
  const btn = document.getElementById('ep-breath-btn');
  if (btn) btn.addEventListener('click', epStartBreath);
}

// ─────────────────────────────────────
//  AI INPUT / INTERACT TAB
// ─────────────────────────────────────
function epInitAiInput() {
  const btn = document.getElementById('ep-ai-send');
  const input = document.getElementById('ep-ai-input');
  const response = document.getElementById('ep-ai-response');
  const slider = document.getElementById('ep-emotion-slider');
  const sliderVal = document.getElementById('ep-slider-val');

  if (slider && sliderVal) {
    slider.addEventListener('input', () => {
      sliderVal.textContent = `${slider.value} / 10`;
      if (epState.currentPlanetId) epSave(undefined, slider.value);
    });
  }

  if (!btn || !input || !response) return;

  btn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;

    const data = EP_DATA[epState.currentPlanetId];
    const pool = data?.aiResponses || [
      'Cảm ơn bạn đã chia sẻ. Cảm xúc của bạn hoàn toàn hợp lệ và được lắng nghe.',
    ];
    response.textContent = pool[Math.floor(Math.random() * pool.length)];
    response.classList.add('visible');
    input.value = '';

    if (slider) epSave(undefined, slider.value);
  });
}

// ─────────────────────────────────────
//  SHARED FEELINGS
// ─────────────────────────────────────
function epInitFeelings() {
  const list = document.getElementById('ep-feelings-list');
  if (!list) return;

  const shuffled = [...EP_FEELINGS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  list.innerHTML = shuffled.map(msg =>
    `<div class="ep-feeling-item">${msg}</div>`
  ).join('');
}

function epSetFeelingsVisible(show) {
  const section = document.getElementById('ep-feelings-section');
  if (section) section.classList.toggle('visible', show);
}

// ─────────────────────────────────────
//  MUTATION OBSERVER — watch panel state
// ─────────────────────────────────────
function epObservePanel() {
  const panel = document.getElementById('planetPanel');
  if (!panel) return;

  let lastVisible = false;
  let lastPlanetId = null;

  new MutationObserver(() => {
    const isVisible = panel.classList.contains('visible');
    const nameEl = document.getElementById('panelName');
    const planetId = isVisible ? (nameEl?.textContent || '').trim().toLowerCase() : null;

    // Ngăn MutationObserver chạy vô hạn: chỉ xử lý khi trạng thái chuyển đổi hoặc đổi hành tinh
    if (isVisible === lastVisible && planetId === lastPlanetId) {
      return;
    }

    lastVisible = isVisible;
    lastPlanetId = planetId;

    if (isVisible) {
      epState.currentPlanetId = planetId;

      epApplyTheme(planetId);
      epPopulateTabs(planetId);
      epSwitchTab('overview');       // always start on overview
      epSetFeelingsVisible(true);
      setTimeout(epSyncMenuIcon, 0);

      // persist last selected
      epSave(planetId);

      // clear AI response from previous planet
      const resp = document.getElementById('ep-ai-response');
      if (resp) resp.classList.remove('visible');
      const inp = document.getElementById('ep-ai-input');
      if (inp) inp.value = '';

    } else {
      epSetFeelingsVisible(false);
      epStopBreath();
      epState.currentPlanetId = null;

      // remove theme classes on close
      const panel2 = document.getElementById('planetPanel');
      if (panel2) {
        Object.values(EP_DATA).forEach(d => panel2.classList.remove(d.themeClass));
        panel2.classList.remove('ep-enhanced');
        // restore panel-body
        const pb = panel2.querySelector('.panel-body');
        if (pb) pb.style.display = '';
      }
    }
  }).observe(panel, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
}

// ─────────────────────────────────────
//  INIT
// ─────────────────────────────────────
function epInit() {
  epInitNavbar();
  epInitTabs();
  epInitBreathing();
  epInitAiInput();
  epInitFeelings();
  epRestoreVisit();
  epObservePanel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', epInit);
} else {
  epInit();
}
