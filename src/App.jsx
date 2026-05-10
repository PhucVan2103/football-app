import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  BarChart3, 
  ChevronLeft, 
  Bell, 
  Home,
  User,
  ChevronDown,
  Search,
  MoreVertical,
  Calendar as CalendarIcon,
  Activity,
  Zap,
  Settings,
  Star,
  ChevronRight,
  LogOut,
  Swords,
  Medal
} from 'lucide-react';

// ==========================================
// CÁC BIẾN DỮ LIỆU TOÀN CỤC (GLOBAL DATA)
// ==========================================

const TEAM_LOGOS_MAP = {
  'Arsenal': 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  'Man City': 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  'Liverpool': 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  'Aston Villa': 'https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_logo.svg',
  'Tottenham': 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  'Chelsea': 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  'Newcastle': 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
  'Man United': 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  'West Ham': 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
  'Real Madrid': 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  'Barcelona': 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg',
  'Atletico': 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
  'Girona': 'https://upload.wikimedia.org/wikipedia/en/9/90/Girona_FC_logo.svg',
  'Sevilla': 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg',
  'Inter Milan': 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
  'AC Milan': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
  'Juventus': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg',
  'Napoli': 'https://upload.wikimedia.org/wikipedia/commons/2/28/S.S.C._Napoli_logo.svg',
  'Roma': 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg',
  'Leverkusen': 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg',
  'Bayern': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
  'Dortmund': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
  'Leipzig': 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg',
  'PSG': 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
  'Monaco': 'https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg',
  'Marseille': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg',
  'Porto': 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg',
  'Benfica': 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg'
};
const getLogo = (teamName) => TEAM_LOGOS_MAP[teamName] || "";

const TEAM_COLORS = {
  'Man United': '#dc2626', 'Arsenal': '#ef4444', 'Barcelona': '#1d4ed8', 'PSG': '#1e3a8a',
  'Man City': '#93c5fd', 'Liverpool': '#dc2626', 'Real Madrid': '#a1a1aa', 'Bayern': '#dc2626',
  'Juventus': '#a1a1aa', 'AC Milan': '#dc2626', 'Real Betis': '#22c55e', 'Sevilla': '#ef4444',
  'Inter Milan': '#2563eb', 'Napoli': '#3b82f6', 'Chelsea': '#2563eb', 'Tottenham': '#a1a1aa',
  'Atletico': '#dc2626', 'Valencia': '#f97316', 'Lyon': '#dc2626', 'Marseille': '#93c5fd',
  'Roma': '#b91c1c', 'Lazio': '#93c5fd', 'Dortmund': '#facc15', 'Porto': '#2563eb', 'Leverkusen': '#dc2626'
};
const getColor = (team) => TEAM_COLORS[team] || '#3f3f46';

// ==========================================
// CẤU HÌNH API - (CHÚ Ý DÒNG NÀY KHI CHẠY DƯỚI MÁY)
// ==========================================
// KHI CHẠY TRÊN VS CODE CỦA BẠN, HÃY XÓA DÒNG "const API_KEY = ... " Ở DƯỚI VÀ MỞ COMMENT DÒNG NÀY RA:
const API_KEY = import.meta.env.VITE_API_KEY || "";
//const API_KEY = ""; 


const API_LEAGUE_IDS = {
  'Premier League': 39,
  'La Liga': 140,
  'Serie A': 135,
  'Bundesliga': 78,
  'Ligue 1': 61,
  'Champions League': 2
};

const getCurrentSeason = () => {
  // Fix cứng mùa giải 2024 do tài khoản API-Sports Free không hỗ trợ mùa giải mới hơn
  return 2024;
};

const generateDates = () => {
  const dates = [];
  // Lấy ngày tháng giả lập là 10/05/2025 (cuối mùa 2024/2025) để test API trả về danh sách trận đấu
  // Nếu lấy thời gian thực (năm 2026) kết hợp với season 2024, API sẽ trả về mảng rỗng []
  const baseDate = new Date(2025, 4, 10); 
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  for (let i = -2; i <= 4; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    dates.push({
      day: dayNames[d.getDay()],
      date: d.getDate().toString().padStart(2, '0'),
      fullDate: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    });
  }
  return dates;
};
const dynamicDatesData = generateDates();

// Dữ liệu giả (Mock) khởi tạo cho các trận đấu
const mockScheduleData = [
  { id: 0, time: '18:00', league: 'Premier League', teamA: 'Man United', teamB: 'Arsenal', score: '1 - 1', status: 'FT', isLive: false },
  { id: 1, time: '20:00', league: 'Champions League', teamA: 'Barcelona', teamB: 'PSG', score: '2 - 0', status: 'Live', isLive: true },
  { id: 2, time: '22:30', league: 'Premier League', teamA: 'Man City', teamB: 'Liverpool', score: '0 - 0', status: 'Sắp đá', isLive: false },
];

const teamALineup = [{ id: 'a1', name: 'Ter Stegen', number: '1', top: '90%', left: '50%', rating: '7.5' }, { id: 'a2', name: 'Cancelo', number: '2', top: '78%', left: '15%', rating: '6.8' }, { id: 'a3', name: 'Christensen', number: '15', top: '78%', left: '35%', rating: '7.1' }, { id: 'a4', name: 'Araújo', number: '4', top: '78%', left: '65%', rating: '7.8' }, { id: 'a5', name: 'Koundé', number: '23', top: '78%', left: '85%', rating: '7.0' }, { id: 'a6', name: 'De Jong', number: '21', top: '67%', left: '28%', rating: '8.1' }, { id: 'a7', name: 'Gündoğan', number: '22', top: '67%', left: '50%', rating: '7.4' }, { id: 'a8', name: 'Pedri', number: '8', top: '67%', left: '72%', rating: '7.2' }, { id: 'a9', name: 'Raphinha', number: '11', top: '58%', left: '22%', rating: '8.5' }, { id: 'a10', name: 'Lewandowski', number: '9', top: '58%', left: '50%', rating: '6.5' }, { id: 'a11', name: 'Yamal', number: '27', top: '58%', left: '78%', rating: '9.2' }];
const teamBLineup = [{ id: 'b1', name: 'Donnarumma', number: '99', top: '10%', left: '50%', rating: '6.0' }, { id: 'b2', name: 'Hakimi', number: '2', top: '22%', left: '15%', rating: '6.5' }, { id: 'b3', name: 'Marquinhos', number: '5', top: '22%', left: '35%', rating: '5.8' }, { id: 'b4', name: 'Škriniar', number: '37', top: '22%', left: '65%', rating: '6.2' }, { id: 'b5', name: 'Hernández', number: '21', top: '22%', left: '85%', rating: '5.5' }, { id: 'b6', name: 'Vitinha', number: '17', top: '33%', left: '28%', rating: '6.9' }, { id: 'b7', name: 'Ugarte', number: '4', top: '33%', left: '50%', rating: '6.1' }, { id: 'b8', name: 'Zaïre-Emery', number: '33', top: '33%', left: '72%', rating: '6.4' }, { id: 'b9', name: 'Dembélé', number: '10', top: '42%', left: '22%', rating: '7.1' }, { id: 'b10', name: 'Mbappé', number: '7', top: '42%', left: '50%', rating: '6.8' }, { id: 'b11', name: 'Barcola', number: '29', top: '42%', left: '78%', rating: '6.0' }];
const timelineEvents = [{ id: 0, time: "90+5'", type: 'goal', player: 'L. Yamal', assist: 'Raphinha', detail: 'Siêu phẩm sút xa!', side: 'left', isRecent: true }, { id: 1, time: "90'", type: 'info', label: 'Bù giờ 5 phút', side: 'center' }, { id: 2, time: "83'", type: 'sub', playerIn: 'S. Busquets', playerOut: 'P. Alcácer', side: 'left' }, { id: 3, time: "78'", type: 'goal', player: 'S. Busquets', side: 'left' }, { id: 4, time: "71'", type: 'yellow_card', player: 'A. Rabiot', side: 'right' }, { id: 101, time: "60'", type: 'info', label: 'Kiểm soát bóng: 62% - 38%', side: 'center' }, { id: 5, time: "52'", type: 'sub', playerIn: 'A. Gomes', playerOut: 'I. Rakitic', side: 'left' }, { id: 102, time: "50'", type: 'danger', player: 'Raphinha', side: 'left', detail: 'Sút xa dội xà ngang!' }, { id: 6, time: "46'", type: 'half_end', label: 'Hết hiệp 1', side: 'center', extra: '+1\'' }, { id: 7, time: "44'", type: 'goal', player: 'Neymar Jr', side: 'right' }, { id: 103, time: "40'", type: 'danger', player: 'K. Mbappé', side: 'right', detail: 'Bỏ lỡ cơ hội đối mặt' }, { id: 8, time: "31'", type: 'goal_penalty', player: 'K. Mbappé', side: 'right', detail: 'Penalty' }, { id: 11, time: "0'", type: 'match_start', label: 'Bắt đầu', side: 'center' }];
const statsData = [{ label: 'Số cú sút', a: 14, b: 9 }, { label: 'Sút trúng đích', a: 6, b: 3 }, { label: 'Chuyền bóng', a: 540, b: 320 }, { label: 'Tỷ lệ chuyền', a: 88, b: 79, format: '%' }, { label: 'Phạt góc', a: 5, b: 2 }, { label: 'Thẻ vàng', a: 1, b: 3 }];
const topLeaguesStandings = {
  'Premier League': [{ pos: 1, team: 'Arsenal', p: 38, w: 28, d: 5, l: 5, pts: 89 }, { pos: 2, team: 'Man City', p: 38, w: 28, d: 4, l: 6, pts: 88 }, { pos: 3, team: 'Liverpool', p: 38, w: 24, d: 10, l: 4, pts: 82 }, { pos: 4, team: 'Aston Villa', p: 38, w: 20, d: 8, l: 10, pts: 68 }, { pos: 5, team: 'Tottenham', p: 38, w: 20, d: 6, l: 12, pts: 66 }, { pos: 6, team: 'Chelsea', p: 38, w: 18, d: 9, l: 11, pts: 63 }],
  'La Liga': [{ pos: 1, team: 'Real Madrid', p: 38, w: 29, d: 8, l: 1, pts: 95 }, { pos: 2, team: 'Barcelona', p: 38, w: 26, d: 7, l: 5, pts: 85 }, { pos: 3, team: 'Girona', p: 38, w: 25, d: 6, l: 7, pts: 81 }, { pos: 4, team: 'Atletico', p: 38, w: 24, d: 4, l: 10, pts: 76 }, { pos: 5, team: 'Athletic Club', p: 38, w: 19, d: 11, l: 8, pts: 68 }],
  'Champions League': [{ pos: 1, team: 'Real Madrid', p: 8, w: 7, d: 1, l: 0, pts: 22 }, { pos: 2, team: 'Man City', p: 8, w: 6, d: 2, l: 0, pts: 20 }, { pos: 3, team: 'Bayern', p: 8, w: 6, d: 1, l: 1, pts: 19 }, { pos: 4, team: 'Barcelona', p: 8, w: 5, d: 2, l: 1, pts: 17 }, { pos: 5, team: 'Arsenal', p: 8, w: 5, d: 1, l: 2, pts: 16 }]
};
const mockH2HList = ['3 - 2', '1 - 1', '0 - 2', '2 - 1', '0 - 0'];
const mockRecentA = [{ score: '2 - 0', opp: 'Real Madrid' }, { score: '1 - 1', opp: 'Bayern' }, { score: '3 - 1', opp: 'Juventus' }];
const mockRecentB = [{ score: '1 - 0', opp: 'Liverpool' }, { score: '3 - 0', opp: 'Arsenal' }, { score: '2 - 2', opp: 'Man City' }];
const mockKeyPlayers = { teamA: { name: 'Lewandowski', img: 'https://ui-avatars.com/api/?name=Robert+Lewandowski&background=1d4ed8&color=fff&size=128&bold=true', attack: 85, pass: 80, def: 30, assist: 1, goal: 1 }, teamB: { name: 'Mbappé', img: 'https://ui-avatars.com/api/?name=Kylian+Mbappe&background=1e3a8a&color=fff&size=128&bold=true', attack: 92, pass: 85, def: 20, assist: 0, goal: 2 } };


// ==========================================
// SHARED COMPONENTS
// ==========================================
const TeamLogo = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center bg-[#27272a] rounded-full ${className}`} style={{ width: '100%', height: '100%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[60%] h-[60%] text-zinc-500"><circle cx="12" cy="12" r="10"></circle><path d="M12 12l3-2.5-1-4-4 1-1 4 3 2.5z"></path><path d="M12 12v5.5"></path><path d="M15 9.5l4.5-2"></path><path d="M9 9.5L4.5 7.5"></path><path d="M11 17.5l-4.5 3"></path><path d="M13 17.5l4.5 3"></path></svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={() => setHasError(true)} />;
};

const MatchCard = ({ item, onClick }) => {
  const colorA = getColor(item.teamA);
  const colorB = getColor(item.teamB);

  return (
    <div 
      className={`w-full rounded-[20px] p-[1px] cursor-pointer group active:scale-[0.98] transition-all relative overflow-hidden ${
        item.isLive ? 'border border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 'border border-[#27272a] hover:border-[#3f3f46]'
      }`}
      style={{ background: item.isLive ? 'none' : `linear-gradient(to right, ${colorA}30, transparent 30%, transparent 70%, ${colorB}30)` }}
      onClick={() => onClick(item)}
    >
      <div className="bg-[#202024]/90 backdrop-blur-xl rounded-[19px] p-3.5 h-full relative">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[12px] font-black tracking-wider ${item.isLive ? 'text-[#4ade80] animate-pulse' : 'text-zinc-200'}`}>{item.time}</span>
            <div className="w-1 h-1 rounded-full bg-[#3f3f46]"></div>
            <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">{item.league}</span>
          </div>
          {item.isLive ? (
            <span className="text-[9px] font-black text-[#064e3b] bg-[#4ade80] px-2 py-0.5 rounded shadow-[0_0_8px_rgba(74,222,128,0.6)] uppercase tracking-wider">Live</span>
          ) : (
            <span className="text-[10px] font-semibold text-[#a1a1aa] bg-[#18181b]/50 px-2 py-0.5 rounded">{item.status}</span>
          )}
        </div>

        <div className="flex justify-between items-center relative z-10">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 blur-[20px] rounded-full opacity-30 pointer-events-none" style={{ backgroundColor: colorA }}></div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 blur-[20px] rounded-full opacity-30 pointer-events-none" style={{ backgroundColor: colorB }}></div>

          <div className="flex flex-col items-center gap-1.5 w-[35%] relative z-10">
            <div className="w-11 h-11 flex-shrink-0 bg-white/5 p-1.5 rounded-full backdrop-blur-sm">
              <TeamLogo src={item.logoA || getLogo(item.teamA)} className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="text-[10px] font-bold text-center text-white w-full truncate">{item.teamA}</span>
          </div>

          <div className={`text-2xl font-black tracking-tighter w-[30%] text-center z-10 ${item.isLive ? 'text-[#4ade80]' : 'text-white'}`}>{item.score}</div>

          <div className="flex flex-col items-center gap-1.5 w-[35%] relative z-10">
            <div className="w-11 h-11 flex-shrink-0 bg-white/5 p-1.5 rounded-full backdrop-blur-sm">
              <TeamLogo src={item.logoB || getLogo(item.teamB)} className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="text-[10px] font-bold text-center text-white w-full truncate">{item.teamB}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// MAIN APP COMPONENT
// ==========================================
const App = () => {
  const [activeTab, setActiveTab] = useState('schedule'); 
  const [selectedMatchTab, setSelectedMatchTab] = useState('Chi tiết'); 
  const [selectedDateIndex, setSelectedDateIndex] = useState(2);
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState('Tất cả');
  const [selectedStandingsLeague, setSelectedStandingsLeague] = useState('Champions League');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(mockScheduleData[1]); 

  // === STATE CHO API ===
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isStandingsLoading, setIsStandingsLoading] = useState(false); // Thêm loading riêng cho Bảng xếp hạng
  const [apiMatches, setApiMatches] = useState(mockScheduleData);
  const [apiStandings, setApiStandings] = useState(topLeaguesStandings);
  const [apiStatus, setApiStatus] = useState(API_KEY ? 'Đang kết nối...' : 'Mock Data');

  // LOGIC GỌI API CHO LỊCH THI ĐẤU
  useEffect(() => {
    const fetchMatches = async () => {
      if (!API_KEY) {
        console.log("[Matches] Không tìm thấy API_KEY. Đang sử dụng Mock Data.");
        setApiMatches(mockScheduleData);
        setApiStatus('Mock Data');
        return;
      }

      setIsApiLoading(true);
      try {
        const targetDate = dynamicDatesData[selectedDateIndex].fullDate;
        const activeSeason = getCurrentSeason();
        console.log(`[Matches] Đang lấy Lịch thi đấu Premier League (mùa ${activeSeason}) cho ngày ${targetDate}...`);
        
        const response = await fetch(`https://v3.football.api-sports.io/fixtures?league=39&season=${activeSeason}&date=${targetDate}`, {
          method: 'GET',
          headers: { 'x-apisports-key': API_KEY }
        });
        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
          console.error("[Matches] Lỗi từ API-Sports:", data.errors);
          setApiStatus('Lỗi API Key');
          return;
        }

        if (data.response) {
          console.log(`[Matches] API trả về ${data.response.length} trận đấu!`);
          const fetchedMatches = data.response.map(item => {
            const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(item.fixture.status.short);
            const statusMap = {
              'NS': 'Sắp đá', 'FT': 'FT', 'HT': 'Nghỉ', '1H': 'Hiệp 1', '2H': 'Hiệp 2', 'CANC': 'Hủy', 'PST': 'Hoãn'
            };
            const dateObj = new Date(item.fixture.date);
            const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            return {
              id: item.fixture.id,
              time: timeStr,
              league: 'Premier League', 
              teamA: item.teams.home.name,
              teamB: item.teams.away.name,
              logoA: item.teams.home.logo, 
              logoB: item.teams.away.logo,
              score: `${item.goals.home ?? '-'} - ${item.goals.away ?? '-'}`,
              status: isLive ? 'Live' : (statusMap[item.fixture.status.short] || item.fixture.status.short),
              isLive: isLive
            };
          });
          
          setApiMatches(fetchedMatches);
          setApiStatus('LIVE API');
        }
      } catch (error) {
        console.error("[Matches] Lỗi Network khi gọi API:", error);
        setApiStatus('Lỗi kết nối');
      } finally {
        setIsApiLoading(false);
      }
    };

    fetchMatches();
  }, [selectedDateIndex]);

  // LOGIC GỌI API CHO BẢNG XẾP HẠNG
  useEffect(() => {
    const fetchRealStandings = async () => {
      if (!API_KEY) {
        console.log("[Standings] Không tìm thấy API_KEY. Đang sử dụng Mock Data.");
        return; 
      }
      
      setIsStandingsLoading(true);
      try {
        const leagueId = API_LEAGUE_IDS[selectedStandingsLeague];
        const activeSeason = getCurrentSeason(); 
        
        console.log(`[Standings] Đang lấy Bảng xếp hạng ID: ${leagueId} mùa giải ${activeSeason}...`);

        const response = await fetch(`https://v3.football.api-sports.io/standings?league=${leagueId}&season=${activeSeason}`, {
          method: 'GET',
          headers: { 'x-apisports-key': API_KEY }
        });
        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
          console.error("[Standings] Lỗi từ API-Sports:", data.errors);
          setApiStatus('Lỗi API Key');
          return;
        }

        if (data.response && data.response.length > 0) {
          console.log("[Standings] Đã kéo thành công dữ liệu bảng xếp hạng thật!");
          const allStandings = data.response[0].league.standings.flat();
          const fetchedStandings = allStandings.map(team => ({
            pos: team.rank,
            team: team.team.name,
            logo: team.team.logo, 
            p: team.all.played,
            w: team.all.win,
            d: team.all.draw,
            l: team.all.lose,
            pts: team.points
          }));
          
          fetchedStandings.sort((a, b) => a.pos - b.pos);
          
          setApiStandings(prev => ({
            ...prev,
            [selectedStandingsLeague]: fetchedStandings
          }));
          setApiStatus('LIVE API');
        } else {
          console.warn("[Standings] Cảnh báo: Mảng trả về rỗng. Giải đấu này chưa cập nhật mùa mới?");
        }
      } catch (error) {
        console.error("[Standings] Lỗi Network:", error);
      } finally {
        setIsStandingsLoading(false);
      }
    };

    fetchRealStandings();
  }, [selectedStandingsLeague]);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setActiveTab('match-detail');
    setSelectedMatchTab('Chi tiết');
  };

  const Header = ({ title, showLeagueToggle }) => (
    <div className="px-5 pt-14 pb-3">
      <div className="flex justify-between items-center mb-2">
        <div className="relative flex flex-col gap-1">
          {showLeagueToggle ? (
            <button className="flex items-center gap-2 bg-[#27272a] px-3 py-1.5 rounded-full shadow-sm">
              <Trophy size={14} className="text-[#4ade80]" />
              <span className="text-xs font-semibold tracking-wide text-zinc-100">Premier League</span>
              <ChevronDown size={14} className="text-[#a1a1aa]" />
            </button>
          ) : (
            <h1 className="text-[28px] font-extrabold tracking-tight text-white">{title}</h1>
          )}
          
          {/* LUÔN HIỂN THỊ TRẠNG THÁI API ĐỂ DỄ DÀNG KIỂM TRA (DEBUG) */}
          <div className="flex items-center gap-1.5 mt-0.5 ml-2">
             <div className={`w-1.5 h-1.5 rounded-full ${API_KEY && apiStatus === 'LIVE API' ? 'bg-[#4ade80] animate-pulse' : 'bg-amber-500'}`}></div>
             <span className="text-[9px] font-bold text-[#a1a1aa] uppercase tracking-widest">
               {API_KEY ? apiStatus : 'MOCK DATA'}
             </span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <button className="w-10 h-10 flex items-center justify-center bg-[#27272a] rounded-full active:scale-95"><Search size={18} className="text-[#a1a1aa]" /></button>
          <button className="w-10 h-10 flex items-center justify-center bg-[#27272a] rounded-full active:scale-95 relative">
            <Bell size={18} className="text-[#a1a1aa]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#4ade80] rounded-full border-[1.5px] border-[#27272a]"></span>
          </button>
        </div>
      </div>
    </div>
  );

  const ScheduleView = () => (
    <div className="flex flex-col h-full bg-[#18181b] text-zinc-100 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-28">
      <Header showLeagueToggle />
      <div className="w-full border-b border-[#27272a] mb-4">
        <div className="flex px-2 justify-between">
          {dynamicDatesData.map((item, i) => (
            <div key={i} onClick={() => setSelectedDateIndex(i)} className={`flex-1 min-w-[45px] flex flex-col items-center pb-2.5 pt-1.5 cursor-pointer relative transition-colors ${i === selectedDateIndex ? 'text-[#4ade80]' : 'text-[#a1a1aa] hover:text-zinc-300'}`}>
              <span className="text-[9px] font-semibold uppercase mb-0.5">{item.day}</span>
              <span className="text-[15px] font-bold">{item.date}</span>
              {i === selectedDateIndex && <div className="absolute bottom-0 w-8 h-[3px] bg-[#4ade80] rounded-t-full shadow-[0_-2px_8px_rgba(74,222,128,0.5)]"></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight text-white">Trận đấu nổi bật</h3>
          <span onClick={() => setActiveTab('all-matches')} className="text-[10px] font-semibold text-[#4ade80] cursor-pointer px-2.5 py-1 bg-[#1e3a2e] rounded-full transition-colors">Xem tất cả</span>
        </div>
        <div className="flex flex-col gap-3 relative min-h-[200px]">
          {isApiLoading ? (
            <div className="absolute inset-0 bg-[#18181b]/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
              <div className="w-8 h-8 border-[3px] border-[#4ade80] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : apiMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#71717a]">
              <CalendarIcon size={36} className="mb-3 opacity-30" />
              <p className="text-sm font-medium text-white">Không có trận đấu</p>
              <p className="text-[11px] mt-1">Không có lịch thi đấu vào ngày này</p>
            </div>
          ) : (
            apiMatches.slice(0, 5).map(match => <MatchCard key={match.id} item={match} onClick={handleMatchClick} />)
          )}
        </div>
      </div>
    </div>
  );

  const AllMatchesView = () => {
    const leagues = ['Tất cả', ...new Set(apiMatches.map(m => m.league))];
    const filteredData = selectedLeagueFilter === 'Tất cả' ? apiMatches : apiMatches.filter(m => m.league === selectedLeagueFilter);
    const targetMonth = dynamicDatesData[selectedDateIndex]?.fullDate.split('-')[1];

    return (
      <div className="flex flex-col h-full bg-[#18181b] text-zinc-100 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-28 pt-14">
        <div className="px-5 pb-4 flex items-center gap-3">
          <button onClick={() => setActiveTab('schedule')} className="w-10 h-10 flex items-center justify-center bg-[#27272a] rounded-full active:scale-95 transition-transform"><ChevronLeft size={18} className="text-zinc-300" /></button>
          <div className="flex flex-col">
            <h2 className="text-[18px] font-bold text-white">Lịch thi đấu</h2>
            <span className="text-[11px] text-[#a1a1aa] font-medium">Thứ {dynamicDatesData[selectedDateIndex]?.day}, {dynamicDatesData[selectedDateIndex]?.date}/{targetMonth}</span>
          </div>
        </div>
        <div className="flex overflow-x-auto gap-3 px-5 pb-3 mb-3 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          {leagues.map(league => (
            <button key={league} onClick={() => setSelectedLeagueFilter(league)} className={`shrink-0 snap-start whitespace-nowrap px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors border ${selectedLeagueFilter === league ? 'bg-[#1e3a2e] text-[#4ade80] border-[#2a5a44]' : 'bg-[#27272a] text-[#a1a1aa] border-transparent hover:text-white'}`}>{league}</button>
          ))}
        </div>
        <div className="px-5 pb-6">
           <div className="grid grid-cols-2 gap-3 relative min-h-[300px]">
             {isApiLoading ? (
               <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-[3px] border-[#4ade80] border-t-transparent rounded-full animate-spin"></div></div>
             ) : filteredData.length === 0 ? (
               <div className="absolute inset-0 flex items-center justify-center text-[#71717a] text-sm">Không có dữ liệu</div>
             ) : filteredData.map((item) => {
               const colorA = getColor(item.teamA);
               const colorB = getColor(item.teamB);
               return (
                 <div key={item.id} onClick={() => handleMatchClick(item)} className={`rounded-[16px] p-[1px] flex flex-col cursor-pointer relative overflow-hidden group active:scale-95 transition-all ${item.isLive ? 'border border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 'border border-[#27272a] hover:border-zinc-700'}`} style={{ background: item.isLive ? 'none' : `linear-gradient(to right, ${colorA}30, transparent 40%, transparent 60%, ${colorB}30)` }}>
                   <div className="bg-[#202024]/90 backdrop-blur-xl rounded-[15px] p-3 h-full flex flex-col relative">
                     <div className="flex justify-between items-center mb-3"><span className={`text-[11px] font-black ${item.isLive ? 'text-[#4ade80] animate-pulse' : 'text-zinc-200'}`}>{item.time}</span>{item.isLive ? <span className="text-[8px] font-black text-emerald-950 bg-[#4ade80] px-1.5 py-0.5 rounded uppercase tracking-wider shadow-[0_0_8px_rgba(74,222,128,0.6)]">Live</span> : <span className="text-[9px] font-medium text-[#a1a1aa] uppercase truncate bg-[#27272a] px-1.5 py-0.5 rounded">{item.status}</span>}</div>
                     <div className="flex justify-between items-center relative z-10 flex-1">
                       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 blur-[12px] rounded-full opacity-40 pointer-events-none" style={{ backgroundColor: colorA }}></div>
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 blur-[12px] rounded-full opacity-40 pointer-events-none" style={{ backgroundColor: colorB }}></div>
                       <div className="flex flex-col items-center gap-1.5 w-[35%] relative z-10"><div className="w-8 h-8 flex-shrink-0 bg-white/5 p-1 rounded-full"><TeamLogo src={item.logoA || getLogo(item.teamA)} className="w-full h-full object-contain" /></div><span className="text-[9px] font-bold text-center text-zinc-100 w-full truncate">{item.teamA}</span></div>
                       <div className={`text-sm font-black tracking-tighter w-[30%] text-center z-10 ${item.isLive ? 'text-[#4ade80]' : 'text-white'}`}>{item.score}</div>
                       <div className="flex flex-col items-center gap-1.5 w-[35%] relative z-10"><div className="w-8 h-8 flex-shrink-0 bg-white/5 p-1 rounded-full"><TeamLogo src={item.logoB || getLogo(item.teamB)} className="w-full h-full object-contain" /></div><span className="text-[9px] font-bold text-center text-zinc-100 w-full truncate">{item.teamB}</span></div>
                     </div>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    );
  };

  // MÀN HÌNH BẢNG XẾP HẠNG 
  const StandingsView = () => {  
    const leagues = ['Champions League', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga'];
    const currentStandings = apiStandings[selectedStandingsLeague] || [];
    return (
      <div className="flex flex-col h-full bg-[#18181b] text-zinc-100 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-28">
        <Header title="Bảng xếp hạng" />
        <div className="flex overflow-x-auto gap-3 px-5 pb-4 pt-2 mb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          {leagues.map(league => (
            <button 
              key={league} 
              onClick={() => setSelectedStandingsLeague(league)} 
              className={`shrink-0 snap-start whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${
                selectedStandingsLeague === league 
                  ? 'bg-[#1c3227] text-[#4ade80] border-[#224f38]' 
                  : 'bg-[#27272a] text-[#a1a1aa] border-transparent hover:text-white hover:bg-[#3f3f46]'
              }`}
            >
              {league}
            </button>
          ))}
        </div>
        <div className="px-5 relative">
          <div className="bg-[#222226] border-[1.5px] border-[#4c3a6f] rounded-[24px] overflow-hidden shadow-lg">
            <div className="flex items-center px-5 py-4 text-[10px] font-bold text-[#71717a] uppercase tracking-widest border-b border-white/5">
              <span className="w-8">#</span>
              <span className="flex-1">Câu lạc bộ</span>
              <div className="flex gap-4 w-[120px] justify-end">
                <span className="w-5 text-center">T</span>
                <span className="w-5 text-center">H</span>
                <span className="w-5 text-center">B</span>
                <span className="w-6 text-right text-white">Đ</span>
              </div>
            </div>
            <div className="flex flex-col relative pb-2 pt-1 min-h-[250px]">
              
              {/* Hiệu ứng loading quay khi đang gọi API */}
              {isStandingsLoading && (
                <div className="absolute inset-0 bg-[#222226]/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-[3px] border-[#4ade80] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {currentStandings.map((team, idx) => {
                let rankColor = 'text-[#71717a] font-medium';
                if (team.pos <= 4) rankColor = 'text-[#4ade80] font-bold';
                
                return (
                  <div key={idx} onClick={() => { setSelectedTeam(team); setActiveTab('team-detail'); }} className="flex items-center px-5 py-3.5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <span className={`w-8 text-[13px] ${rankColor}`}>{team.pos}</span>
                    <div className="flex-1 flex items-center gap-3 truncate pr-2">
                      <div className="w-7 h-7 shrink-0 bg-white/5 p-1 rounded-full"><TeamLogo src={team.logo || getLogo(team.team)} className="w-full h-full object-contain" /></div>
                      <span className="text-[14px] font-bold text-white truncate group-hover:text-[#4ade80] transition-colors">{team.team}</span>
                    </div>
                    <div className="flex gap-4 w-[120px] justify-end text-[13px] font-semibold text-[#a1a1aa]">
                      <span className="w-5 text-center">{team.w}</span>
                      <span className="w-5 text-center">{team.d}</span>
                      <span className="w-5 text-center">{team.l}</span>
                      <span className="w-6 text-right text-white font-extrabold">{team.pts}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TeamDetailView = () => { 
     if (!selectedTeam) return null;
     const total = selectedTeam.p || 1;
     const wPct = (selectedTeam.w / total) * 100;
     const dPct = (selectedTeam.d / total) * 100;
     
     const upcomingMatches = [
       { id: 201, date: '25/05', opp: 'Chelsea', venue: 'Sân khách', logo: getLogo('Chelsea'), time: '20:00' },
       { id: 202, date: '29/05', opp: 'Real Madrid', venue: 'Sân nhà', logo: getLogo('Real Madrid'), time: '02:00' },
       { id: 203, date: '02/06', opp: 'Liverpool', venue: 'Sân khách', logo: getLogo('Liverpool'), time: '22:30' },
     ];

     return (
       <div className="flex flex-col h-full bg-[#18181b] text-zinc-100 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-28 pt-14">
          <button onClick={() => setActiveTab('standings')} className="w-10 h-10 ml-5 flex items-center justify-center bg-[#27272a] rounded-full active:scale-95"><ChevronLeft size={18} className="text-zinc-300" /></button>
          <div className="flex flex-col items-center mt-6">
            <div className="w-24 h-24 mb-4 bg-white/5 p-3 rounded-full"><TeamLogo src={selectedTeam.logo || getLogo(selectedTeam.team)} className="w-full h-full object-contain drop-shadow-2xl" /></div>
            <h2 className="text-[28px] font-extrabold text-white">{selectedTeam.team}</h2>
            <span className="text-xs text-[#4ade80] font-semibold mt-1">{selectedStandingsLeague}</span>
          </div>

          <div className="px-5 mt-10 space-y-7">
            {/* Tỉ lệ kết quả */}
            <div>
              <h3 className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider mb-3">Tỉ lệ kết quả</h3>
              <div className="bg-[#222226] border border-[#27272a] rounded-[24px] p-5 flex items-center justify-between">
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-inner" style={{ background: `conic-gradient(#4ade80 0% ${wPct}%, #71717a ${wPct}% ${wPct + dPct}%, #ef4444 ${wPct + dPct}% 100%)` }}>
                  <div className="w-14 h-14 bg-[#222226] rounded-full flex flex-col items-center justify-center shadow-md"><span className="text-[9px] text-[#a1a1aa] font-medium">Số trận</span><span className="text-[15px] font-black text-white leading-none mt-0.5">{selectedTeam.p || selectedTeam.w + selectedTeam.d + selectedTeam.l}</span></div>
                </div>
                <div className="flex flex-col gap-2.5 w-[50%]">
                  <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]"></div><span className="text-xs font-semibold text-zinc-300">Thắng</span></div><span className="text-xs font-bold text-[#4ade80]">{selectedTeam.w}</span></div>
                  <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-zinc-500"></div><span className="text-xs font-semibold text-zinc-300">Hòa</span></div><span className="text-xs font-bold text-zinc-300">{selectedTeam.d}</span></div>
                  <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-xs font-semibold text-zinc-300">Thua</span></div><span className="text-xs font-bold text-red-400">{selectedTeam.l}</span></div>
                </div>
              </div>
            </div>

            {/* Lịch thi đấu sắp tới */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">Lịch thi đấu sắp tới</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {upcomingMatches.map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#222226] border border-[#27272a] rounded-[20px] p-4 hover:border-zinc-700 cursor-pointer transition-colors">
                    <div className="flex flex-col gap-1 w-[25%]">
                      <span className="text-[11px] font-bold text-zinc-300">{m.date}</span>
                      <span className="text-[9px] font-medium text-[#71717a] uppercase tracking-wide">{m.venue}</span>
                    </div>
                    <div className="flex items-center gap-3 w-[50%]">
                      <div className="w-8 h-8 flex-shrink-0 bg-white/5 p-1 rounded-full"><TeamLogo src={m.logo} className="w-full h-full object-contain" /></div>
                      <span className="text-[13px] font-bold text-white truncate">{m.opp}</span>
                    </div>
                    <div className="w-[25%] text-right">
                      <span className="text-[10px] font-bold text-[#4ade80] bg-[#1e3a2e] px-2.5 py-1.5 rounded-md tracking-wider">{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
       </div>
     )
  };
  
  const CalendarView = () => { return <div className="h-full bg-[#18181b] p-20 text-white text-center pt-32">Calendar View</div> };
  const ProfileView = () => { return <div className="h-full bg-[#18181b] p-20 text-white text-center pt-32">Profile View</div> };


  // 6. Màn hình Chi tiết Trận Đấu (Match Detail)
  const MatchDetailView = () => {
    if (!selectedMatch) return null;
    const isUpcoming = ['Sắp đá', 'Ngày mai', 'NS'].includes(selectedMatch.status);

    const getRadarCoords = (angleIdx, val, centerX = 110, centerY = 100, radius = 65) => {
      const angle = (Math.PI * 2 * angleIdx) / 5 - Math.PI / 2;
      return {
        x: centerX + radius * val * Math.cos(angle),
        y: centerY + radius * val * Math.sin(angle)
      };
    };

    const radarStats = [
      { label: 'Tấn công', max: 100, a: mockKeyPlayers.teamA.attack, b: mockKeyPlayers.teamB.attack },
      { label: 'Chuyền', max: 100, a: mockKeyPlayers.teamA.pass, b: mockKeyPlayers.teamB.pass },
      { label: 'Thủ', max: 100, a: mockKeyPlayers.teamA.def, b: mockKeyPlayers.teamB.def },
      { label: 'Bàn thắng', max: 5, a: mockKeyPlayers.teamA.goal, b: mockKeyPlayers.teamB.goal },
      { label: 'Kiến tạo', max: 5, a: mockKeyPlayers.teamA.assist, b: mockKeyPlayers.teamB.assist },
    ];
    
    const pathA = radarStats.map((s, i) => { const c = getRadarCoords(i, s.a/s.max); return `${c.x},${c.y}`; }).join(' ');
    const pathB = radarStats.map((s, i) => { const c = getRadarCoords(i, s.b/s.max); return `${c.x},${c.y}`; }).join(' ');

    const colorA = getColor(selectedMatch.teamA);
    const colorB = getColor(selectedMatch.teamB);

    return (
      <div className="flex flex-col h-full bg-[#18181b] text-zinc-100 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-28 pt-14">
        {/* Top Navigation */}
        <div className="px-5 pb-3 flex justify-between items-center">
          <button onClick={() => setActiveTab('schedule')} className="w-10 h-10 flex items-center justify-center bg-[#27272a] rounded-full active:scale-95"><ChevronLeft size={18} className="text-zinc-300" /></button>
          {selectedMatch.isLive ? (
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div><span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span></div>
          ) : (
            <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">{selectedMatch.league}</span>
          )}
          <button className="w-10 h-10 flex items-center justify-center bg-[#27272a] rounded-full active:scale-95"><MoreVertical size={18} className="text-zinc-300" /></button>
        </div>
        
        {/* Scoreboard */}
        <div className="px-5 py-6 flex justify-between items-center">
          <div className="flex flex-col items-center gap-3 w-1/3"><div className="w-14 h-14 shrink-0 bg-white/5 p-2 rounded-full"><TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-full h-full object-contain drop-shadow-lg" /></div><span className="text-[13px] font-bold text-center text-white">{selectedMatch.teamA}</span></div>
          <div className="flex flex-col items-center w-1/3">
            <div className="text-[40px] font-black tracking-tighter flex items-center gap-3 relative">
              {selectedMatch.isLive && <div className="absolute -inset-4 bg-[#4ade80]/20 blur-xl rounded-full animate-pulse"></div>}
              <span className={`z-10 ${selectedMatch.isLive ? 'text-[#4ade80]' : 'text-white'}`}>{selectedMatch.score.split(' ')[0]}</span>
              <span className="text-[#3f3f46] font-light text-[32px] pb-2 z-10">-</span>
              <span className={`z-10 ${selectedMatch.isLive ? 'text-[#4ade80]' : 'text-white'}`}>{selectedMatch.score.split(' ')[2]}</span>
            </div>
            <div className="mt-1">
               {selectedMatch.isLive ? (
                 <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded text-red-500 shadow-sm"><Activity size={12} className="animate-pulse" /><span className="text-[10px] font-bold">55'</span></div>
               ) : (
                 <span className="text-[11px] font-bold text-[#a1a1aa] bg-[#27272a] px-3 py-1 rounded-full">{selectedMatch.time}</span>
               )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 w-1/3"><div className="w-14 h-14 shrink-0 bg-white/5 p-2 rounded-full"><TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-full h-full object-contain drop-shadow-lg" /></div><span className="text-[13px] font-bold text-center text-white">{selectedMatch.teamB}</span></div>
        </div>

        {/* Tabs - Đổi tên thành Chi tiết */}
        <div className="flex bg-[#27272a] p-1 rounded-full mx-5 mb-6 mt-4">
          {['Chi tiết', 'Đội hình', 'Thống kê'].map(t => <button key={t} onClick={() => setSelectedMatchTab(t)} className={`flex-1 py-2.5 text-[13px] font-bold rounded-full transition-all ${selectedMatchTab === t ? 'bg-[#18181b] text-white shadow-sm' : 'text-[#a1a1aa] hover:text-white'}`}>{t}</button>)}
        </div>

        <div className="flex-1 bg-[#202024] rounded-t-[36px] p-6">
          
          {/* TAB 1: CHI TIẾT */}
          {selectedMatchTab === 'Chi tiết' && (
            <div className="flex flex-col gap-8">
              
              {/* TRƯỜNG HỢP: SẮP ĐÁ */}
              {isUpcoming ? (
                <>
                  {/* Lịch sử đối đầu */}
                  <div>
                    <h3 className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider mb-4 flex items-center gap-2"><Swords size={14}/> Lịch sử đối đầu</h3>
                    
                    {/* Thống kê Thắng/Hòa/Thua */}
                    <div className="mb-4 px-1">
                      <div className="flex justify-between text-[10px] font-bold mb-2">
                        <span style={{ color: colorA }}>2 Thắng</span>
                        <span className="text-[#a1a1aa]">2 Hòa</span>
                        <span style={{ color: colorB }}>1 Thắng</span>
                      </div>
                      <div className="flex h-2 w-full bg-[#18181b] rounded-full overflow-hidden">
                        <div className="h-full" style={{ width: '40%', backgroundColor: colorA }}></div>
                        <div className="h-full bg-[#71717a]" style={{ width: '40%' }}></div>
                        <div className="h-full" style={{ width: '20%', backgroundColor: colorB }}></div>
                      </div>
                    </div>

                    {/* Danh sách thẻ đối đầu (Đã thu nhỏ 30%) */}
                    <div className="flex gap-3 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
                      {mockH2HList.map((score, i) => (
                        <div key={i} className="snap-start shrink-0 flex items-center justify-center gap-2.5 bg-[#18181b] border border-[#27272a] px-3 py-2 rounded-[12px]">
                          <TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-5 h-5 object-contain drop-shadow-sm" />
                          <span className="text-[13px] font-black tracking-wider text-white">{score}</span>
                          <TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-5 h-5 object-contain drop-shadow-sm" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phong độ (Gộp 2 đội) */}
                  <div>
                    <h3 className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider mb-4 flex items-center gap-2"><Activity size={14}/> Phong độ</h3>
                    <div className="flex flex-col gap-4">
                      {/* Hàng Đội A */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 bg-[#18181b] rounded-full flex items-center justify-center border border-[#27272a]">
                          <TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-6 h-6 object-contain drop-shadow-sm" />
                        </div>
                        <div className="flex gap-2.5 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {mockRecentA.map((m, i) => (
                            <div key={i} className="snap-start shrink-0 flex items-center justify-center gap-2.5 bg-[#18181b] border border-[#27272a] px-3 py-2 rounded-[12px]">
                              <TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-5 h-5 object-contain drop-shadow-sm" />
                              <span className="text-[13px] font-black tracking-wider text-white">{m.score}</span>
                              <TeamLogo src={getLogo(m.opp)} className="w-5 h-5 object-contain drop-shadow-sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Hàng Đội B */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 bg-[#18181b] rounded-full flex items-center justify-center border border-[#27272a]">
                          <TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-6 h-6 object-contain drop-shadow-sm" />
                        </div>
                        <div className="flex gap-2.5 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {mockRecentB.map((m, i) => (
                            <div key={i} className="snap-start shrink-0 flex items-center justify-center gap-2.5 bg-[#18181b] border border-[#27272a] px-3 py-2 rounded-[12px]">
                              <TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-5 h-5 object-contain drop-shadow-sm" />
                              <span className="text-[13px] font-black tracking-wider text-white">{m.score}</span>
                              <TeamLogo src={getLogo(m.opp)} className="w-5 h-5 object-contain drop-shadow-sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cầu thủ nổi bật - Biểu đồ Radar */}
                  <div>
                    <h3 className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider mb-4 flex items-center gap-2"><Star size={14}/> Nổi bật trận trước</h3>
                    
                    <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-5 flex flex-col items-center">
                      {/* Tiêu đề (Legends) */}
                      <div className="flex justify-between items-center w-full mb-4">
                        <div className="flex items-center gap-3 w-[45%]">
                           <div className="relative">
                             <img src={mockKeyPlayers.teamA.img} alt={mockKeyPlayers.teamA.name} className="w-10 h-10 rounded-full bg-[#27272a] border-2 border-[#10b981] object-cover" />
                             <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] border-2 border-[#18181b] rounded-full"></div>
                           </div>
                           <div className="flex flex-col overflow-hidden">
                             <span className="text-[11px] font-bold text-[#10b981] truncate">{mockKeyPlayers.teamA.name}</span>
                             <span className="text-[9px] font-semibold text-[#71717a] uppercase truncate">{selectedMatch.teamA}</span>
                           </div>
                        </div>
                        
                        <span className="text-[11px] font-black text-[#3f3f46]">VS</span>
                        
                        <div className="flex items-center gap-3 w-[45%] flex-row-reverse text-right">
                           <div className="relative">
                             <img src={mockKeyPlayers.teamB.img} alt={mockKeyPlayers.teamB.name} className="w-10 h-10 rounded-full bg-[#27272a] border-2 border-[#3b82f6] object-cover" />
                             <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-[#3b82f6] border-2 border-[#18181b] rounded-full"></div>
                           </div>
                           <div className="flex flex-col items-end overflow-hidden">
                             <span className="text-[11px] font-bold text-[#3b82f6] truncate">{mockKeyPlayers.teamB.name}</span>
                             <span className="text-[9px] font-semibold text-[#71717a] uppercase truncate">{selectedMatch.teamB}</span>
                           </div>
                        </div>
                      </div>

                      {/* Radar Chart SVG */}
                      <div className="w-[220px] h-[200px] relative mt-2">
                        <svg viewBox="0 0 220 200" className="w-full h-full overflow-visible">
                          {/* Khung mạng nhện (Grids) */}
                          {[0.25, 0.5, 0.75, 1].map((level, i) => {
                            const points = radarStats.map((_, j) => {
                              const c = getRadarCoords(j, level);
                              return `${c.x},${c.y}`;
                            }).join(' ');
                            return <polygon key={`grid-${i}`} points={points} fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray={level === 1 ? "0" : "3,3"} />;
                          })}
                          
                          {/* Các trục nối từ tâm ra (Axes) */}
                          {radarStats.map((_, i) => {
                            const c = getRadarCoords(i, 1);
                            return <line key={`axis-${i}`} x1="110" y1="100" x2={c.x} y2={c.y} stroke="#27272a" strokeWidth="1" />;
                          })}
                          
                          {/* Mảng màu của Đội A và Đội B (Polygons) */}
                          <polygon points={pathA} fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
                          <polygon points={pathB} fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />

                          {/* Nhãn (Labels) cho 5 chỉ số và Điểm số 2 đội */}
                          {radarStats.map((stat, i) => {
                            const c = getRadarCoords(i, 1.35);
                            return (
                              <text key={`lbl-${i}`} x={c.x} y={c.y} fontSize="9" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
                                <tspan fill="#10b981">{stat.a}</tspan>
                                <tspan fill="#a1a1aa">   {stat.label}   </tspan>
                                <tspan fill="#3b82f6">{stat.b}</tspan>
                              </text>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* TRƯỜNG HỢP: ĐÃ ĐÁ / ĐANG LIVE */
                <>
                  <div className="flex flex-col gap-5 mb-2">
                    {/* Kiểm soát bóng */}
                    <div className="bg-[#18181b] border border-[#27272a] p-5 rounded-[24px]">
                       <h3 className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider mb-3 text-center">Kiểm soát bóng</h3>
                       <div className="flex justify-between items-end mb-2 px-1">
                          <span className="text-[20px] font-black text-[#4ade80]">62%</span>
                          <span className="text-[20px] font-black text-white">38%</span>
                       </div>
                       <div className="flex h-2.5 gap-1.5">
                         <div className="flex-1 bg-[#27272a] rounded-full overflow-hidden"><div className="h-full bg-[#4ade80] w-[62%] float-right"></div></div>
                         <div className="flex-1 bg-[#27272a] rounded-full overflow-hidden"><div className="h-full bg-white w-[38%]"></div></div>
                       </div>
                    </div>

                    {/* Cầu thủ xuất sắc nhất */}
                    <div className="bg-[#1c3227] border border-[#224f38] p-4 rounded-[24px] flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-[#4ade80]/20 flex items-center justify-center border border-[#4ade80]/30">
                         <Medal size={24} className="text-[#4ade80]"/>
                       </div>
                       <div className="flex-1">
                         <h3 className="text-[10px] font-bold text-[#4ade80] uppercase tracking-wider mb-1">Cầu thủ xuất sắc nhất</h3>
                         <span className="text-[15px] font-bold text-white">L. Yamal</span> <span className="text-[11px] text-[#a1a1aa]">({selectedMatch.teamA})</span>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-[#4ade80] flex items-center justify-center text-[#18181b] font-black text-base shadow-md">
                         9.2
                       </div>
                    </div>
                  </div>

                  {/* Timeline Sự kiện */}
                  <h3 className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider mt-4 mb-3">Dòng thời gian</h3>
                  <div className="space-y-7 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-[#27272a]">
                    {timelineEvents.map((event) => (
                      <div key={event.id} className="relative flex items-center justify-between w-full group">
                        <div className={`w-[42%] flex flex-col ${event.side === 'left' ? 'items-end text-right' : 'items-start text-left opacity-0'}`}>
                          {event.side === 'left' && (
                            <>
                              <div className="flex items-center gap-2 justify-end">
                                {event.type.includes('goal') && <span className="text-sm drop-shadow-md">⚽</span>}
                                <span className={`font-bold ${event.isRecent ? 'text-[#4ade80] text-[14px]' : 'text-white text-[13px]'}`}>{event.player || event.playerIn}</span>
                              </div>
                              {event.playerOut && <span className="text-[11px] text-[#71717a] font-medium mt-1">Ra: {event.playerOut}</span>}
                              {event.detail && event.type !== 'danger' && <span className="text-[11px] text-[#4ade80] font-medium mt-1">{event.detail}</span>}
                            </>
                          )}
                        </div>
                        
                        <div className="w-8 h-8 absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                          {event.side === 'center' ? (
                            <div className={`border text-[10px] font-bold px-3 py-1.5 rounded-full z-10 whitespace-nowrap ${event.type === 'info' ? 'bg-[#1e3a2e] border-[#2a5a44] text-[#4ade80]' : 'bg-[#27272a] border-[#3f3f46] text-[#a1a1aa]'}`}>{event.label}</div>
                          ) : (
                            <div className={`w-7 h-7 rounded-full border-[3px] border-[#202024] z-10 flex items-center justify-center text-[10px] font-black ${event.type.includes('goal') ? `bg-[#4ade80] text-[#18181b] ${event.isRecent ? 'animate-pulse' : ''}` : event.type === 'yellow_card' ? 'bg-yellow-400 text-yellow-900' : 'bg-[#27272a] text-[#a1a1aa]'}`}>
                              {event.time.replace("'", "")}
                            </div>
                          )}
                        </div>

                        <div className={`w-[42%] flex flex-col ${event.side === 'right' ? 'items-start text-left' : 'items-end text-right opacity-0'}`}>
                          {event.side === 'right' && (
                            <>
                              <div className="flex items-center gap-2 justify-start">
                                <span className={`font-bold ${event.isRecent ? 'text-[#4ade80] text-[14px]' : 'text-white text-[13px]'}`}>{event.player || event.playerIn}</span>
                                {event.type.includes('goal') && <span className="text-sm drop-shadow-md">⚽</span>}
                              </div>
                              {event.playerOut && <span className="text-[11px] text-[#71717a] font-medium mt-1">Ra: {event.playerOut}</span>}
                              {event.detail && event.type !== 'danger' && <span className="text-[11px] text-[#4ade80] font-medium mt-1">{event.detail}</span>}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: ĐỘI HÌNH */}
          {selectedMatchTab === 'Đội hình' && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-[#18181b] border-[1.5px] border-[#3f3f46]"></div><div className="flex flex-col"><span className="text-[13px] font-bold text-white">{selectedMatch.teamA}</span><span className="text-[10px] text-[#4ade80] font-semibold">4-3-3</span></div></div>
                <div className="flex items-center gap-3 flex-row-reverse"><div className="w-4 h-4 rounded-full bg-white border-[1.5px] border-[#a1a1aa]"></div><div className="flex flex-col items-end"><span className="text-[13px] font-bold text-white">{selectedMatch.teamB}</span><span className="text-[10px] text-[#4ade80] font-semibold">4-3-3</span></div></div>
              </div>
              
              <div className="relative w-full aspect-[2/3] bg-[#064e3b] rounded-[24px] overflow-hidden shadow-inner border-[4px] border-[#18181b]">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_10%,rgba(0,0,0,0.1)_10%,rgba(0,0,0,0.1)_20%)] pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-white/40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-[1.5px] border-white/40 rounded-full"></div>
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-[16%] border-[1.5px] border-white/40 border-t-0"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[25%] h-[6%] border-[1.5px] border-white/40 border-t-0"></div>
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[16%] border-[1.5px] border-white/40 border-b-0"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[6%] border-[1.5px] border-white/40 border-b-0"></div>
              
                {teamBLineup.map((player) => (
                  <div key={player.id} className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform cursor-pointer" style={{ top: player.top, left: player.left }}>
                    <span className="text-[9px] font-bold text-[#18181b] mb-1 shadow-sm bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded leading-none whitespace-nowrap">{player.name}</span>
                    <div className="relative flex items-center justify-center">
                      {!isUpcoming && (
                         <span className={`absolute right-full mr-2 text-[8px] font-black px-1.5 py-0.5 rounded-sm shadow-md border border-black/10 ${parseFloat(player.rating) >= 7.0 ? 'bg-[#4ade80] text-[#18181b]' : parseFloat(player.rating) >= 6.0 ? 'bg-amber-400 text-[#18181b]' : 'bg-red-500 text-white'}`}>
                            {player.rating}
                         </span>
                      )}
                      <div className="w-[30px] h-[30px] shrink-0 rounded-full flex items-center justify-center text-[11px] font-black leading-none shadow-md bg-white border border-[#a1a1aa] text-[#18181b]">
                         {player.number}
                      </div>
                    </div>
                  </div>
                ))}

                {teamALineup.map((player) => (
                  <div key={player.id} className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform cursor-pointer" style={{ top: player.top, left: player.left }}>
                    <div className="relative flex items-center justify-center">
                      {!isUpcoming && (
                         <span className={`absolute right-full mr-2 text-[8px] font-black px-1.5 py-0.5 rounded-sm shadow-md border border-white/10 ${parseFloat(player.rating) >= 7.0 ? 'bg-[#4ade80] text-[#18181b]' : parseFloat(player.rating) >= 6.0 ? 'bg-amber-400 text-[#18181b]' : 'bg-red-500 text-white'}`}>
                            {player.rating}
                         </span>
                      )}
                      <div className="w-[30px] h-[30px] shrink-0 rounded-full flex items-center justify-center text-[11px] font-black leading-none shadow-md bg-[#18181b] border border-[#3f3f46] text-white">
                         {player.number}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-white mt-1 shadow-sm bg-[#18181b]/95 backdrop-blur-sm px-2 py-0.5 rounded border border-[#3f3f46] leading-none whitespace-nowrap">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THỐNG KÊ */}
          {selectedMatchTab === 'Thống kê' && (
            <div className="flex flex-col gap-6 pt-3">
               {isUpcoming ? (
                 <div className="text-center py-10 text-[#71717a] text-sm font-medium">Chưa có thống kê</div>
               ) : (
                 statsData.map((stat, idx) => {
                   const total = stat.a + stat.b;
                   const pctA = total === 0 ? 50 : (stat.a / total) * 100;
                   const pctB = total === 0 ? 50 : (stat.b / total) * 100;
                   return (
                     <div key={idx} className="flex flex-col gap-2.5">
                       <div className="flex justify-between items-center text-[12px] font-bold">
                         <span className={`w-10 ${stat.a >= stat.b ? 'text-[#4ade80]' : 'text-[#71717a]'}`}>{stat.a}{stat.format === '%' ? '%' : ''}</span>
                         <span className="text-zinc-200 text-center flex-1">{stat.label}</span>
                         <span className={`w-10 text-right ${stat.b >= stat.a ? 'text-[#4ade80]' : 'text-[#71717a]'}`}>{stat.b}{stat.format === '%' ? '%' : ''}</span>
                       </div>
                       <div className="flex h-2 gap-1.5">
                         <div className="flex-1 bg-[#18181b] rounded-full flex justify-end overflow-hidden"><div className={`h-full rounded-full ${stat.a >= stat.b ? 'bg-[#4ade80]' : 'bg-[#4ade80]/40'}`} style={{ width: `${pctA}%` }}></div></div>
                         <div className="flex-1 bg-[#18181b] rounded-full overflow-hidden"><div className={`h-full rounded-full ${stat.b >= stat.a ? 'bg-white' : 'bg-[#71717a]'}`} style={{ width: `${pctB}%` }}></div></div>
                       </div>
                     </div>
                   );
                 })
               )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const BOTTOM_TABS = [
    { id: 'schedule', icon: Home },
    { id: 'calendar', icon: CalendarIcon },
    { id: 'standings', icon: BarChart3 },
    { id: 'profile', icon: User }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-200 p-4 font-sans">
      {/* Phone Mockup */}
      <div className="relative w-[380px] h-[812px] bg-[#18181b] rounded-[55px] border-[8px] border-[#27272a] shadow-2xl overflow-hidden">
        
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-7 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 bg-[#18181b] rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-[#4ade80]/20 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full"></div></div>
        </div>

        {/* Global App Background is now darker #18181b */}
        <div className="h-full w-full bg-[#18181b] relative">
          {/* Controllers */}
          {activeTab === 'schedule' && <ScheduleView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'standings' && <StandingsView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'all-matches' && <AllMatchesView />}
          {activeTab === 'match-detail' && <MatchDetailView />}
          {activeTab === 'team-detail' && <TeamDetailView />}

          {/* Floating Navigation */}
          <div className="absolute bottom-6 left-6 right-6 z-40 bg-[#222226]/95 backdrop-blur-xl h-[64px] flex items-center justify-around border border-white/5 px-2 rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
            {BOTTOM_TABS.map(tab => {
              const isScheduleFlow = tab.id === 'schedule' && ['schedule', 'all-matches', 'match-detail'].includes(activeTab);
              const isStandingsFlow = tab.id === 'standings' && ['standings', 'team-detail'].includes(activeTab);
              const isActive = activeTab === tab.id || isScheduleFlow || isStandingsFlow;

              return (
                <button 
                  key={tab.id} onClick={() => setActiveTab(tab.id)} 
                  className={`relative flex flex-col items-center justify-center w-[64px] h-[46px] transition-all duration-300 rounded-[20px] ${isActive ? 'bg-[#213f31]' : ''}`}
                >
                  <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`mb-1 ${isActive ? 'text-[#4ade80]' : 'text-[#71717a]'}`} />
                  {isActive && <span className="absolute bottom-1.5 w-1 h-1 bg-[#4ade80] rounded-full"></span>}
                </button>
              );
            })}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-zinc-300 rounded-full z-50"></div>
        </div>

        {/* Nút vật lý mô phỏng */}
        <div className="absolute left-[-10px] top-28 w-[3px] h-8 bg-zinc-700 rounded-l-sm"></div>
        <div className="absolute left-[-10px] top-44 w-[3px] h-16 bg-zinc-700 rounded-l-sm"></div>
        <div className="absolute left-[-10px] top-64 w-[3px] h-16 bg-zinc-700 rounded-l-sm"></div>
        <div className="absolute right-[-10px] top-52 w-[3px] h-24 bg-zinc-700 rounded-r-sm"></div>
      </div>
    </div>
  );
};

export default App;