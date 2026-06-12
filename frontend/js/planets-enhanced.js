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
    emotion: 'Cô Đơn',
    themeClass: 'planet-theme-mercury',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_34dbd0b0ef.mp3?filename=space-ambience-124619.mp3',
    youtubeLinks: [
      { title: 'Làm thế nào để đối diện với sự cô đơn? (Psych2Go)', url: 'https://www.youtube.com/watch?v=inpok4MKVLM' },
      { title: 'Nhạc Tần Số 432Hz Chữa Lành Tế Bào & Xoa Dịu', url: 'https://www.youtube.com/watch?v=1zxjCGDPUKM' }
    ],
    quotes: [
      'Cô đơn không phải là không có ai bên cạnh, mà là cảm giác không thể sẻ chia điều trong lòng.',
      'Sao Thủy lầm lũi trong quỹ đạo, tựa như tâm hồn xoay quanh những khoảng trống cô độc.',
      'Sự tĩnh lặng đôi khi là một tấm khiên bảo vệ, nhưng cũng là một nhà tù vô hình.',
      'Hãy bao dung với khoảng trống trong lòng bạn. Nó đang đợi một sự thấu cảm thực sự.',
    ],
    symptoms: [
      'Cảm thấy bản thân vô hình ngay cả khi đứng giữa đám đông bè bạn trò chuyện',
      'Thường xuyên ngắt kết nối, từ chối tin nhắn và tự thu mình vào khoảng lặng',
      'Mất đi hứng thú giao tiếp, cảm thấy việc giãi bày tâm sự là vô nghĩa',
    ],
    causes: [
      'Sự mất kết nối số: Mạng xã hội tạo ra ảo giác tương tác nhưng làm rỗng đi liên kết thực',
      'Rào cản lòng tin: Tổn thương cũ khiến tâm trí dựng rào chắn để tránh bị từ chối',
      'Thay đổi môi trường: Chuyển chỗ ở, đổi trường học hoặc nơi làm việc đột ngột',
    ],
    advice: [
      'Thực hiện các hành động kết nối nhỏ (Micro-connection) không áp lực',
      'Trò chuyện với chính mình một cách thấu cảm thay vì tự phán xét',
      'Chấp nhận sự cô đơn như một tín hiệu tự nhiên báo rằng bạn đang cần tình cảm chân thành',
    ],
    actions: [
      { step: 1, text: 'Gửi một tin nhắn hỏi thăm ngắn đến một người bạn cũ mà bạn tin tưởng' },
      { step: 2, text: 'Uống một cốc nước ấm chậm rãi để cảm nhận hơi ấm lan tỏa cơ thể' },
      { step: 3, text: 'Thực hành đi bộ chậm rãi và chào hỏi một người phục vụ hoặc bảo vệ' },
    ],
    aiResponses: [
      'Tôi đang ở đây lắng nghe tín hiệu của bạn. Sự cô đơn của bạn hoàn toàn được thấu cảm.',
      'Sao Thủy bé nhỏ lầm lũi trong vũ trụ rộng lớn, nhưng luôn có những ngôi sao khác sẵn lòng cộng hưởng cùng bạn.',
    ],
  },

  venus: {
    emotion: 'Yêu Thương',
    themeClass: 'planet-theme-venus',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf584.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    youtubeLinks: [
      { title: 'Tâm lý học đằng sau tình yêu thương & Sự gắn kết (TED)', url: 'https://www.youtube.com/watch?v=FjI5o25mN_E' },
      { title: 'Nhạc Không Lời Tần Số 528Hz Thúc Đẩy Sự Bao Dung & Yêu Thương', url: 'https://www.youtube.com/watch?v=2OEL4P1Rz04' }
    ],
    quotes: [
      'Yêu thương không phải là để sở hữu, mà là để thấu hiểu và cùng nhau tự do.',
      'Sao Kim rực sáng ấm áp dưới lớp mây khí quyển dày, tựa như một trái tim tràn đầy tình yêu thương đang che chở.',
      'Yêu thương thực sự bắt đầu khi bạn biết trân trọng và bao dung cho chính bản thân mình.',
      'Lan tỏa tình thương giống như gieo những hạt giống tinh tú vào khoảng không vô tận.',
    ],
    symptoms: [
      'Cảm giác muốn gắn kết sâu sắc, bảo bọc và che chở cho những người xung quanh',
      'Thấu thấu suốt và bao dung trước những lỗi lầm của người khác cũng như của chính mình',
      'Khao khát sẻ chia năng lượng tích cực và xây dựng các mối liên kết vững chắc',
    ],
    causes: [
      'Nhu cầu sinh học nguyên thủy về sự an toàn, thuộc về và được bảo vệ',
      'Lòng trắc ẩn tự thân được nuôi dưỡng qua những trải nghiệm chia sẻ sâu sắc',
      'Khả năng thấu cảm tự nhiên khi ta nhận diện và tôn trọng ranh giới cảm xúc của nhau',
    ],
    advice: [
      'Nuôi dưỡng lòng trắc ẩn: Ghi nhận những nỗ lực thầm lặng của bản thân mỗi ngày',
      'Lan tỏa tình cảm lành mạnh: Thực hiện một hành động tử tế nhỏ không cần đáp đền',
      'Trân trọng sự kết nối: Bày tỏ lòng biết ơn chân thành đối với những người đang đồng hành cùng bạn',
    ],
    actions: [
      { step: 1, text: 'Nuôi dưỡng: Viết ra 3 điều bạn tự hào hoặc trân quý nhất ở chính mình hôm nay' },
      { step: 2, text: 'Lan tỏa: Gửi một tin nhắn cảm ơn hoặc chúc lành chân thành đến một người bạn quý mến' },
      { step: 3, text: 'Trân trọng: Dành 3 phút tĩnh lặng để gửi niệm lành, mong cho thế giới xung quanh luôn bình an' },
    ],
    aiResponses: [
      'Tình yêu thương là năng lượng mạnh mẽ nhất vũ trụ. Hãy để trái tim bạn luôn tỏa sáng hơi ấm nhé.',
      'Dưới lớp mây ấm áp của Sao Kim, một nguồn năng lượng bao dung đang sẵn sàng lan tỏa cùng hành trình của bạn.',
    ],
  },

  earth: {
    emotion: 'Lo Âu',
    themeClass: 'planet-theme-earth',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=birds-singing-calm-river-nature-ambient-sound-12508.mp3',
    youtubeLinks: [
      { title: 'Hiểu về cơ chế lo âu của bộ não & Cách xoa dịu', url: 'https://www.youtube.com/watch?v=hFkI69zJzLI' },
      { title: 'Nhạc Không Lời Giúp Hạ Nhịp Tim & Giảm Căng Thẳng', url: 'https://www.youtube.com/watch?v=2OEL4P1Rz04' }
    ],
    quotes: [
      'Lo âu là việc bạn đang vay mượn những rắc rối của tương lai chưa chắc xảy ra.',
      'Trái Đất cân bằng nhờ nhịp tự quay, tâm trí cân bằng nhờ nhịp hít thở.',
      'Mọi cơn bão lo âu rồi cũng sẽ trôi qua khi ý thức bạn neo đậu ở thực tại.',
      'Hãy hít thở. Cơ thể bạn đang an toàn ở khoảnh khắc này.',
    ],
    symptoms: [
      'Nhịp tim nhanh, thở nông và dồn dập, cơ vai gáy căng cứng vô thức',
      'Tâm trí liên tục chạy qua các kịch bản tồi tệ nhất có thể xảy ra ở tương lai',
      'Khó ngủ, giật mình giữa đêm do luồng suy nghĩ lo lắng chạy nhảy liên tục',
    ],
    causes: [
      'Hạch hạnh nhân (Amygdala) phản ứng quá mức trước áp lực không chắc chắn',
      'Tiêu thụ lượng thông tin tiêu cực dồn dập hoặc làm việc quá sức kéo dài',
      'Thói quen cầu toàn, muốn kiểm soát mọi kết quả diễn ra xung quanh',
    ],
    advice: [
      'Thực hành bài tập thở tiếp đất 4-4-4-4 để báo cho não bộ biết bạn đang an toàn',
      'Học cách chấp nhận sự bất định như một phần tự nhiên của cuộc sống',
      'Phân rã nỗi lo thành hai nhóm: Những thứ có thể kiểm soát và không thể kiểm soát',
    ],
    actions: [
      { step: 1, text: 'Áp dụng quy tắc tiếp đất 5-4-3-2-1 để đưa các giác quan trở lại hiện tại' },
      { step: 2, text: 'Tập thở sâu theo nhịp thở bong bóng co giãn trên màn hình trong 3 phút' },
      { step: 3, text: 'Viết toàn bộ nỗi lo ra giấy rồi phân loại hành động cụ thể' },
    ],
    aiResponses: [
      'Hít vào... thở ra... Hệ thần kinh của bạn đang được xoa dịu. Bạn đang an toàn ở đây.',
      'Cơn bão lo âu giống như mây mù bao phủ Trái Đất. Hãy thở đều, mây mù sẽ tan biến và để lộ bầu trời xanh.',
    ],
  },

  mars: {
    emotion: 'Giận Dữ',
    themeClass: 'planet-theme-mars',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_51527ab0d3.mp3?filename=rain-and-thunder-113218.mp3',
    youtubeLinks: [
      { title: 'Làm thế nào để làm nguội cơn giận dữ lập tức?', url: 'https://www.youtube.com/watch?v=BsVq5R_F6RA' },
      { title: 'Tiếng Ồn Nâu (Brown Noise) Giúp Xoa Dịu Hệ Thần Kinh', url: 'https://www.youtube.com/watch?v=hXrtQcMcZJU' }
    ],
    quotes: [
      'Giận dữ là năng lượng mạnh mẽ — hãy dùng nó để dựng ranh giới, đừng để nó thiêu hủy bạn.',
      'Sao Hỏa rực đỏ tựa như ngọn lửa bùng cháy của magma đang cần van giải phóng.',
      'Giữ cơn giận trong lòng giống như uống thuốc độc và mong người khác tổn thương.',
      'Dành ra 10 giây dừng lại trước khi phản xạ có thể cứu vãn mọi mối quan hệ.',
    ],
    symptoms: [
      'Nhiệt độ cơ thể tăng nhanh, lồng ngực nóng ran, tay nắm chặt vô thức',
      'Xung động muốn la hét lớn, đập phá đồ đạc hoặc nói những lời xúc phạm',
      'Suy nghĩ lặp đi lặp lại về việc bị đối xử bất công, bị xâm phạm quyền lợi',
    ],
    causes: [
      'Ranh giới cá nhân hoặc lòng tự tôn bị xâm phạm thô bạo',
      'Tích tụ những ức chế nhỏ trong thời gian dài không được giải tỏa lành mạnh',
      'Sự bất lực trước một tình huống không diễn ra theo ý muốn của bản thân',
    ],
    advice: [
      'Tạm rút khỏi cuộc trò chuyện ngay lập tức để hạ nhiệt cảm xúc (Time-out)',
      'Sử dụng các bài tập vận động cơ học để xả bớt lượng Adrenaline dư thừa',
      'Sử dụng cấu trúc câu "Tôi cảm thấy..." để bày tỏ mong muốn thay vì chỉ trích người khác',
    ],
    actions: [
      { step: 1, text: 'Click liên tục vào van xả áp suất trên màn hình để mô phỏng việc trút giận' },
      { step: 2, text: 'Đi rửa mặt bằng nước lạnh để kích hoạt phản xạ làm chậm nhịp tim' },
      { step: 3, text: 'Thực hiện 5 nhịp hít thở thật sâu bằng mũi và thở ra chậm bằng miệng' },
    ],
    aiResponses: [
      'Năng lượng của bạn đang rất nóng. Hãy trút bỏ sự giận dữ vào đây, tôi sẵn sàng lắng nghe.',
      'Cơn giận bùng nổ trên Sao Hỏa rồi cũng sẽ nguội đi. Hãy kiên nhẫn với bản thân trong 10 giây tiếp theo.',
    ],
  },

  jupiter: {
    emotion: 'Áp Lực',
    themeClass: 'planet-theme-jupiter',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf584.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    youtubeLinks: [
      { title: 'Làm thế nào để giảm tải áp lực cuộc sống? (TEDx)', url: 'https://www.youtube.com/watch?v=FjI5o25mN_E' },
      { title: 'Nhạc Thiền Sóng Não Thư Giãn Đầu Óc & Giảm Tải', url: 'https://www.youtube.com/watch?v=8ZgZ_8xRtzI' }
    ],
    quotes: [
      'Áp lực sinh ra khi bạn cố gánh vác những kỳ vọng vượt ngoài ranh giới của mình.',
      'Sao Mộc khổng lồ chịu ngàn tầng áp suất khí quyển, tựa như vai bạn đang trĩu nặng gánh lo.',
      'Bạn không cần phải hoàn hảo. Đôi khi, làm ở mức vừa đủ đã là một thành công lớn.',
      'Nói lời từ chối là cách bạn bảo vệ nguồn năng lượng sống của chính mình.',
    ],
    symptoms: [
      'Luôn có cảm giác thiếu thời gian, thấy tội lỗi dằn vặt khi cho phép mình nghỉ ngơi',
      'Cơ thể mỏi mệt vùng vai gáy kinh niên, đầu óc căng thẳng khó tập trung',
      'Sợ hãi làm người khác thất vọng, liên tục ôm đồm công việc vào người',
    ],
    causes: [
      'Thói quen cầu toàn thái quá, đặt tiêu chuẩn không thực tế cho bản thân',
      'Áp lực đồng trang lứa và kỳ vọng lớn từ gia đình, xã hội đè nặng',
      'Không biết cách thiết lập ranh giới cá nhân và từ chối các yêu cầu quá tải',
    ],
    advice: [
      'Học cách thiết lập ranh giới và nói lời từ chối với những việc không cần thiết',
      'Chia nhỏ các dự án lớn thành từng bước vi mô và chỉ làm từng việc một',
      'Cho phép bản thân được nghỉ ngơi vô điều kiện mà không dằn vặt tự trách',
    ],
    actions: [
      { step: 1, text: 'Kéo thả các khối gánh nặng kỳ vọng vào hố đen vũ trụ trên màn hình' },
      { step: 2, text: 'Viết ra 3 việc quan trọng nhất cần làm hôm nay và tạm gác phần còn lại' },
      { step: 3, text: 'Dành 15 phút ngắt kết nối hoàn toàn khỏi các thiết bị làm việc' },
    ],
    aiResponses: [
      'Vai bạn đang rất mỏi đúng không? Hãy đặt gánh nặng xuống một chút và nghỉ ngơi đi nhé.',
      'Dưới ngàn tầng áp suất của Sao Mộc, bạn vẫn đang làm rất tốt. Đừng ép mình phải gồng gánh quá sức.',
    ],
  },

  saturn: {
    emotion: 'Trầm Cảm',
    themeClass: 'planet-theme-saturn',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_51db0f19c6.mp3?filename=wind-howling-1-115372.mp3',
    youtubeLinks: [
      { title: 'Vượt qua trầm cảm: Những hành động cực nhỏ giúp phục hồi', url: 'https://www.youtube.com/watch?v=zR7T8O2XGhw' },
      { title: 'Nhạc Không Lời Làm Dịu Tâm Trí & Tiếp Thêm Sức Sống', url: 'https://www.youtube.com/watch?v=V1bFr2SWP1I' }
    ],
    quotes: [
      'Trầm cảm không phải là yếu đuối, đó là khi cơ thể bạn đã gồng mình mạnh mẽ quá lâu.',
      'Sao Thổ chìm trong vành đai bóng tối lạnh lẽo, tựa như hố sâu trống rỗng của tâm hồn.',
      'Không cần những bước đi vĩ đại. Hôm nay, chỉ cần uống một ngụm nước ấm đã là đáng quý.',
      'Ánh sáng vẫn luôn tồn tại phía sau vành đai mây mù, chờ bạn thắp sáng từng tinh tú.',
    ],
    symptoms: [
      'Cảm giác trống rỗng bao trùm, mất đi mọi hứng thú và niềm vui trong cuộc sống',
      'Kiệt quệ sinh lực hoàn toàn, gặp khó khăn lớn ngay cả việc bước ra khỏi giường',
      'Trơ lì cảm xúc, thờ ơ trước mọi biến động và muốn cô lập bản thân hoàn toàn',
    ],
    causes: [
      'Sự cạn kiệt serotonin kéo dài sau các biến cố tình cảm hoặc áp lực quá mức',
      'Cơ chế tự vệ phân ly (Dissociation) khi tâm trí bị quá tải cảm xúc tiêu cực',
      'Mất định hướng sống và cảm giác thiếu kết nối sâu sắc với thế giới xung quanh',
    ],
    advice: [
      'Không đặt áp lực phải vui vẻ hay làm việc. Cho phép bản thân ở trạng thái tĩnh lặng',
      'Thực hiện những hành động siêu nhỏ (Micro-actions) không tốn nhiều sinh lực',
      'Tìm kiếm sự giúp đỡ từ những người bạn đáng tin cậy hoặc chuyên gia tâm lý',
    ],
    actions: [
      { step: 1, text: 'Click thắp sáng các ngôi sao nhỏ trên màn hình để tạo chòm sao hy vọng' },
      { step: 2, text: 'Mở rèm cửa đón ánh sáng tự nhiên hoặc rửa mặt nhẹ bằng nước ấm' },
      { step: 3, text: 'Uống một ngụm nước nhỏ và tập trung cảm nhận dòng nước mát lành' },
    ],
    aiResponses: [
      'Tôi không cần bạn phải tỏ ra mạnh mẽ lúc này. Cứ để bản thân được nghỉ ngơi ở đây.',
      'Vành đai Sao Thổ mờ tối lạnh lẽo, nhưng từng đốm sáng nhỏ bạn thắp lên sẽ dẫn lối bạn trở lại.',
    ],
  },

  uranus: {
    emotion: 'Tự Ti',
    themeClass: 'planet-theme-uranus',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_34dbd0b0ef.mp3?filename=space-ambience-124619.mp3',
    youtubeLinks: [
      { title: 'Làm thế nào để ngừng nghi ngờ bản thân và tự tin hơn?', url: 'https://www.youtube.com/watch?v=7h2P4_H2o8c' },
      { title: 'Nhạc Tần Số Nâng Cao Lòng Tự Tôn & Sự Tự Tin Nội Tại', url: 'https://www.youtube.com/watch?v=vV1pS7N6A_s' }
    ],
    quotes: [
      'Tự ti là chiếc kính lọc méo mó phóng đại khuyết điểm và thu nhỏ ưu điểm của bạn.',
      'Sao Thiên Vương quay nghiêng độc nhất, tựa như vẻ đẹp khác biệt đang e ngại tỏa sáng.',
      'Bạn không cần phải giống bất kỳ ai khác để trở nên có giá trị.',
      'Hãy đối xử tử tế với bản thân như cách bạn đối xử với một người bạn thân nhất.',
    ],
    symptoms: [
      'Luôn có suy nghĩ "mình không đủ tốt", phóng đại những sai lầm nhỏ nhặt của bản thân',
      'E ngại bày tỏ ý kiến trước đám đông vì sợ bị phán xét hoặc chê cười',
      'Hội chứng kẻ giả mạo (Impostor Syndrome), nghĩ thành tựu của mình chỉ là may mắn',
    ],
    causes: [
      'Lòng tự tôn bị tổn thương do các lời phán xét tiêu cực trong quá khứ',
      'Thói quen so sánh khuyết điểm của mình với ưu điểm nổi bật của người khác',
      'Tiêu chuẩn quá khắt khe từ môi trường giáo dục hoặc gia đình',
    ],
    advice: [
      'Thực hành ghi nhận những thành tựu nhỏ và ưu điểm thực tế của bản thân',
      'Sử dụng lăng kính nhận thức khách quan để lọc bỏ các suy nghĩ tự phê phán tiêu cực',
      'Chấp nhận rằng sai sót là một phần tất yếu của quá trình học hỏi và phát triển',
    ],
    actions: [
      { step: 1, text: 'Nhập một câu tự ti vào lăng kính lọc trên màn hình để chuyển hóa suy nghĩ' },
      { step: 2, text: 'Viết ra 3 điều bạn đã nỗ lực làm tốt trong tuần này' },
      { step: 3, text: 'Đứng trước gương và tự nói một câu khẳng định giá trị bản thân' },
    ],
    aiResponses: [
      'Bộ lọc tự ti đang che mắt bạn. Hãy nhìn lại những nỗ lực thầm lặng tuyệt vời của mình đi nhé.',
      'Sao Thiên Vương nghiêng bóng đầy kiêu hãnh. Sự khác biệt của bạn chính là nét độc bản đáng trân quý.',
    ],
  },

  neptune: {
    emotion: 'Mất Phương Hướng',
    themeClass: 'planet-theme-neptune',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ocean-waves-ambient-sound-12508.mp3',
    youtubeLinks: [
      { title: 'Tìm lại bản đồ cuộc sống khi bạn bị lạc lối (Psych2Go)', url: 'https://www.youtube.com/watch?v=WWloIAQpMcQ' },
      { title: 'Nhạc Không Gian Định Tâm & Xác Định Hướng Đi Mới', url: 'https://www.youtube.com/watch?v=f77SKdyn-1Y' }
    ],
    quotes: [
      'Lạc lối không phải là dấu chấm hết, nó là điểm bắt đầu của một con đường mới.',
      'Sao Hải Vương mờ tối đầy bão tố, tựa như bản đồ cuộc sống đang bị che phủ bởi sương mù.',
      'Khi không biết đi đâu, hãy dừng lại và tìm về la bàn giá trị cốt lõi bên trong bạn.',
      'Bạn không cần phải có mọi câu trả lời ngay lập tức. Hãy đi từng bước nhỏ một.',
    ],
    symptoms: [
      'Hoang mang sâu sắc khi nghĩ về tương lai, liên tục thay đổi quyết định định hướng',
      'Cảm giác trôi nổi vô định, không biết mục đích sống của mình là gì',
      'Mệt mỏi, chán nản vì thấy các hoạt động hàng ngày trôi qua vô nghĩa',
    ],
    causes: [
      'Chạy theo các mục tiêu và quy chuẩn của người khác thay vì hiểu mong muốn thực sự của mình',
      'Đứng trước quá nhiều sự lựa chọn mà thiếu đi kim chỉ nam giá trị cốt lõi',
      'Thiếu sự thấu suốt về năng lực và ranh giới tự thân',
    ],
    advice: [
      'Dành thời gian xác định lại các giá trị sống quan trọng nhất đối với bạn lúc này',
      'Tập trung hoàn thành tốt các công việc nhỏ trước mắt thay vì lo lắng mục tiêu vĩ mô',
      'Chấp nhận rằng lạc lối là một giai đoạn tự nhiên trước khi định hình bản ngã rõ ràng',
    ],
    actions: [
      { step: 1, text: 'Sắp xếp la bàn giá trị cốt lõi trên màn hình để tìm lại phương hướng phát triển' },
      { step: 2, text: 'Viết ra 1 việc cụ thể bạn có thể hoàn thành tốt ngay trong ngày hôm nay' },
      { step: 3, text: 'Tìm kiếm lời khuyên hoặc trò chuyện định hướng cùng một người cố vấn tin cậy' },
    ],
    aiResponses: [
      'Bản đồ đang mờ nhạt đúng không? Không sao cả, hãy dừng lại và xác định điểm xuất phát của mình trước nhé.',
      'Giữa những cơn bão siêu thanh của Sao Hải Vương, la bàn nội tâm sẽ luôn chỉ lối cho bạn trở về ranh giới an toàn.',
    ],
  },
};

const EP_PAGE_META = {
  mercury: {
    kicker: 'Trạng thái: Cô đơn',
    path: 'Sao Thủy • Khoảng lặng của tâm trí',
    intro: 'Dữ liệu chỉ ra sự cô độc. Bạn cảm thấy ngắt kết nối với thế giới xung quanh và lầm lũi một mình.',
  },
  venus: {
    kicker: 'Trạng thái: Yêu Thương',
    path: 'Sao Kim • Sức mạnh lan tỏa tình thương',
    intro: 'Hệ thống năng lượng yêu thương đang được kích hoạt. Hãy để hơi ấm thấu cảm che chở và kết nối tâm hồn bạn.',
  },
  earth: {
    kicker: 'Trạng thái: Lo âu',
    path: 'Trái Đất • Nhịp hít thở bình yên',
    intro: 'Hệ thống lo âu đang quá tải. Nhịp tim tăng nhanh và tâm trí ngập tràn viễn cảnh bất ổn.',
  },
  mars: {
    kicker: 'Trạng thái: Giận dữ',
    path: 'Sao Hỏa • Ngọn lửa rực lửa bên trong',
    intro: 'Cơn thịnh nộ đang bộc phát mạnh mẽ. Năng lượng giận dữ cần được giải phóng và làm nguội kịp thời.',
  },
  jupiter: {
    kicker: 'Trạng thái: Áp lực',
    path: 'Sao Mộc • Gánh nặng ngàn tầng',
    intro: 'Kỳ vọng đè nặng lên vai. Bạn kiệt sức vì chạy đua với những tiêu chuẩn quá tải.',
  },
  saturn: {
    kicker: 'Trạng thái: Trầm cảm',
    path: 'Sao Thổ • Vòng tối đóng băng cảm xúc',
    intro: 'Trống rỗng bao trùm hoàn toàn. Bạn cạn kiệt sinh lực và thấy cuộc sống nhạt nhòa.',
  },
  uranus: {
    kicker: 'Trạng thái: Tự ti',
    path: 'Sao Thiên Vương • Bộ lọc nghi ngờ bản thân',
    intro: 'Sự nghi ngờ nội tại làm mờ mắt bạn. Bạn phóng đại khuyết điểm và quên đi giá trị của mình.',
  },
  neptune: {
    kicker: 'Trạng thái: Mất phương hướng',
    path: 'Sao Hải Vương • Bản đồ mờ trong sương mù',
    intro: 'Bão vô định đang che phủ. Bạn hoang mang không biết tương lai của mình sẽ đi về đâu.',
  },
};

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

  const panelBody = document.querySelector('#planetPanel .panel-body');
  if (panelBody) {
    panelBody.style.display = (tabId === 'overview') ? '' : 'none';
  }
  if (panel) panel.classList.toggle('ep-overview-active', tabId === 'overview');

  if (tabId !== 'action' && epState.breathingActive) epStopBreath();
}

function epInitTabs() {
  document.querySelectorAll('.ep-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => epSwitchTab(btn.dataset.tab));
  });
}

function epApplyTheme(planetId) {
  const panel = document.getElementById('planetPanel');
  if (!panel) return;

  Object.values(EP_DATA).forEach(d => panel.classList.remove(d.themeClass));
  panel.classList.add('ep-enhanced');

  const data = EP_DATA[planetId];
  if (!data) return;
  const meta = EP_PAGE_META[planetId];

  panel.classList.add(data.themeClass);

  const quoteEl = document.getElementById('ep-quote');
  if (quoteEl) {
    quoteEl.textContent =
      data.quotes[Math.floor(Math.random() * data.quotes.length)];
  }

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

function epRestoreVisit() {
  const { planet, level } = epLoad();
  if (!planet) return;

  const data = EP_DATA[planet];
  if (!data) return;

  const banner = document.getElementById('ep-last-visit');
  if (banner) {
    const lvlTxt = level ? ` • mức ${level}/10` : '';
    banner.textContent = `Lần trước bạn ở trạng thái: ${data.emotion}${lvlTxt}`;
    banner.classList.add('visible');
  }

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

function epObservePanel() {
  const panel = document.getElementById('planetPanel');
  if (!panel) return;

  let lastVisible = false;
  let lastPlanetId = null;

  new MutationObserver(() => {
    const isVisible = panel.classList.contains('visible');
    const nameEl = document.getElementById('panelName');
    const planetId = isVisible ? (nameEl?.textContent || '').trim().toLowerCase() : null;

    if (isVisible === lastVisible && planetId === lastPlanetId) {
      return;
    }

    lastVisible = isVisible;
    lastPlanetId = planetId;

    if (isVisible) {
      epState.currentPlanetId = planetId;

      epApplyTheme(planetId);
      epPopulateTabs(planetId);
      epSwitchTab('overview');
      epSetFeelingsVisible(true);
      setTimeout(epSyncMenuIcon, 0);

      epSave(planetId);

      const resp = document.getElementById('ep-ai-response');
      if (resp) resp.classList.remove('visible');
      const inp = document.getElementById('ep-ai-input');
      if (inp) inp.value = '';

    } else {
      epSetFeelingsVisible(false);
      epStopBreath();
      epState.currentPlanetId = null;

      const panel2 = document.getElementById('planetPanel');
      if (panel2) {
        Object.values(EP_DATA).forEach(d => panel2.classList.remove(d.themeClass));
        panel2.classList.remove('ep-enhanced');
        const pb = panel2.querySelector('.panel-body');
        if (pb) pb.style.display = '';
      }
    }
  }).observe(panel, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
}

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
