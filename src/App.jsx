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
  Star,
  AlignLeft,
  Users,
  Cpu,
  BarChart2,
  Flag,
  ArrowRightLeft
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
// CẤU HÌNH API
// ==========================================
// KHI CHẠY TRÊN MÁY TÍNH (VS CODE), ĐỪNG QUÊN THAY DÒNG DƯỚI THÀNH:
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
  return 2024;
};

// Khôi phục lại ngày tháng thực tế (Hôm nay)
const generateDates = () => {
  const dates = [];
  const today = new Date(); 
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  for (let i = -2; i <= 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      day: dayNames[d.getDay()],
      date: d.getDate().toString().padStart(2, '0'),
      fullDate: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    });
  }
  return dates;
};
const dynamicDatesData = generateDates();

// Dữ liệu giả (Mock)
const mockScheduleData = [
  { id: 1035048, time: '20:00', league: 'Premier League', teamA: 'West Ham', teamB: 'Arsenal', score: '0 - 0', status: "38'", isLive: true },
  { id: 1035049, time: '22:30', league: 'Premier League', teamA: 'Man City', teamB: 'Liverpool', score: '0 - 0', status: 'Sắp đá', isLive: false }
];

const mockTeamALineup = [{ id: 'a1', name: 'De Gea', number: '1', top: '90%', left: '50%' }, { id: 'a2', name: 'Dalot', number: '20', top: '78%', left: '20%' }, { id: 'a3', name: 'Varane', number: '19', top: '78%', left: '50%' }, { id: 'a4', name: 'Shaw', number: '23', top: '78%', left: '80%' }, { id: 'a6', name: 'Casemiro', number: '18', top: '65%', left: '35%' }, { id: 'a7', name: 'Eriksen', number: '14', top: '65%', left: '65%' }, { id: 'a9', name: 'Antony', number: '21', top: '50%', left: '20%' }, { id: 'a10', name: 'Fernandes', number: '8', top: '50%', left: '50%' }, { id: 'a11', name: 'Rashford', number: '10', top: '50%', left: '80%' }, { id: 'a12', name: 'Martial', number: '9', top: '35%', left: '50%' }];
const mockTeamBLineup = [{ id: 'b1', name: 'Ramsdale', number: '1', top: '10%', left: '50%' }, { id: 'b2', name: 'White', number: '4', top: '22%', left: '20%' }, { id: 'b3', name: 'Saliba', number: '12', top: '22%', left: '50%' }, { id: 'b4', name: 'Gabriel', number: '6', top: '22%', left: '80%' }, { id: 'b6', name: 'Partey', number: '5', top: '35%', left: '35%' }, { id: 'b7', name: 'Xhaka', number: '34', top: '35%', left: '65%' }, { id: 'b9', name: 'Saka', number: '7', top: '50%', left: '20%' }, { id: 'b10', name: 'Odegaard', number: '8', top: '50%', left: '50%' }, { id: 'b11', name: 'Martinelli', number: '11', top: '50%', left: '80%' }, { id: 'b12', name: 'Jesus', number: '9', top: '65%', left: '50%' }];
const mockTimelineEvents = [
  { id: 0, time: "38'", type: 'yellow_card', player: 'Summerville', detail: 'Phạm lỗi', side: 'left', isRecent: false },
  { id: 1, time: "34'", type: 'yellow_card', player: 'Castellanos', detail: 'Phạm lỗi', side: 'left', isRecent: false },
  { id: 2, time: "28'", type: 'sub', playerIn: 'Zubimendi', playerOut: 'White', side: 'right', isRecent: false },
];
const mockStatsData = [{ label: 'Số cú sút', a: 14, b: 9 }, { label: 'Sút trúng đích', a: 6, b: 3 }, { label: 'Chuyền bóng', a: 540, b: 320 }, { label: 'Tỷ lệ chuyền', a: 88, b: 79, format: '%' }, { label: 'Phạt góc', a: 5, b: 2 }, { label: 'Thẻ vàng', a: 1, b: 3 }];
const topLeaguesStandings = { 'Premier League': [{ pos: 1, team: 'Arsenal', p: 38, w: 28, d: 5, l: 5, pts: 89 }] };
const mockH2HList = ['3 - 2', '1 - 1', '0 - 2', '2 - 1', '0 - 0'];
const mockRecentA = [{ score: '2 - 0', opp: 'Real Madrid', res: 'W' }, { score: '1 - 1', opp: 'Bayern', res: 'D' }, { score: '3 - 1', opp: 'Juventus', res: 'W' }, { score: '0 - 1', opp: 'AC Milan', res: 'L' }, { score: '2 - 2', opp: 'Roma', res: 'D' }];
const mockRecentB = [{ score: '1 - 0', opp: 'Liverpool', res: 'W' }, { score: '3 - 0', opp: 'Arsenal', res: 'W' }, { score: '1 - 2', opp: 'Chelsea', res: 'L' }, { score: '2 - 2', opp: 'Man City', res: 'D' }, { score: '4 - 1', opp: 'Tottenham', res: 'W' }];


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
            <span className="text-[9px] font-black text-[#064e3b] bg-[#4ade80] px-2 py-0.5 rounded shadow-[0_0_8px_rgba(74,222,128,0.6)] uppercase tracking-wider flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-[#064e3b] rounded-full animate-pulse"></span>
               {item.status}
            </span>
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
  const [activeTab, setActiveTab] = useState('match-detail'); 
  const [selectedMatchTab, setSelectedMatchTab] = useState('Chi tiết'); 
  const [selectedDateIndex, setSelectedDateIndex] = useState(2);
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState('Tất cả');
  const [selectedStandingsLeague, setSelectedStandingsLeague] = useState('Champions League');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(mockScheduleData[0]); 

  // === STATE CHO API ===
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isStandingsLoading, setIsStandingsLoading] = useState(false);
  
  const [matchDetailsData, setMatchDetailsData] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [apiMatches, setApiMatches] = useState(mockScheduleData);
  const [apiStandings, setApiStandings] = useState(topLeaguesStandings);
  const [apiStatus, setApiStatus] = useState(API_KEY ? 'Đang kết nối...' : 'Mock Data');

  useEffect(() => {
    const fetchMatches = async () => {
      if (!API_KEY) {
        setApiMatches(mockScheduleData);
        setApiStatus('Mock Data');
        return;
      }

      setIsApiLoading(true);
      try {
        const targetDate = dynamicDatesData[selectedDateIndex].fullDate;
        
        const response = await fetch(`https://v3.football.api-sports.io/fixtures?date=${targetDate}`, {
          method: 'GET',
          headers: { 'x-apisports-key': API_KEY }
        });
        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
          setApiMatches(mockScheduleData);
          setApiStatus('Mock Data (Lỗi API)');
          setIsApiLoading(false);
          return;
        }

        if (data.response) {
          const premierLeagueMatches = data.response.filter(item => item.league.id === 39);

          if (premierLeagueMatches.length === 0) {
            setApiMatches(mockScheduleData);
            setApiStatus('Mock Data (Trống)');
          } else {
            const fetchedMatches = premierLeagueMatches.map(item => {
              const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(item.fixture.status.short);
              const statusMap = {
                'NS': 'Sắp đá', 'FT': 'FT', 'HT': 'HT', '1H': 'Hiệp 1', '2H': 'Hiệp 2', 'CANC': 'Hủy', 'PST': 'Hoãn'
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
                status: isLive ? (item.fixture.status.elapsed ? `${item.fixture.status.elapsed}'` : (item.fixture.status.short === 'HT' ? 'HT' : 'LIVE')) : (statusMap[item.fixture.status.short] || item.fixture.status.short),
                isLive: isLive
              };
            });
            
            setApiMatches(fetchedMatches);
            setApiStatus('LIVE API');
          }
        }
      } catch (error) {
        console.error("[Matches] Lỗi Network:", error);
        setApiMatches(mockScheduleData);
        setApiStatus('Mock Data (Lỗi Mạng)');
      } finally {
        setIsApiLoading(false);
      }
    };

    fetchMatches();
  }, [selectedDateIndex]);

  useEffect(() => {
    const fetchRealStandings = async () => {
      if (!API_KEY) return; 
      
      setIsStandingsLoading(true);
      try {
        const leagueId = API_LEAGUE_IDS[selectedStandingsLeague];
        const activeSeason = getCurrentSeason(); 
        
        const response = await fetch(`https://v3.football.api-sports.io/standings?league=${leagueId}&season=${activeSeason}`, {
          method: 'GET',
          headers: { 'x-apisports-key': API_KEY }
        });
        const data = await response.json();

        if (data.response && data.response.length > 0) {
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
          setApiStandings(prev => ({ ...prev, [selectedStandingsLeague]: fetchedStandings }));
        }
      } catch (error) {
        console.error("[Standings] Lỗi Network:", error);
      } finally {
        setIsStandingsLoading(false);
      }
    };

    fetchRealStandings();
  }, [selectedStandingsLeague]);

  useEffect(() => {
    if (activeTab !== 'match-detail' || !selectedMatch?.id) return;

    const fetchMatchDetails = async () => {
      if (!API_KEY) {
        setMatchDetailsData(null);
        return;
      }
      setIsDetailsLoading(true);
      try {
        const response = await fetch(`https://v3.football.api-sports.io/fixtures?id=${selectedMatch.id}`, {
          method: 'GET',
          headers: { 'x-apisports-key': API_KEY }
        });
        const data = await response.json();
        
        if (data.response && data.response.length > 0) {
          setMatchDetailsData(data.response[0]);
        } else {
          setMatchDetailsData(null);
        }
      } catch (error) {
        console.error("[Detail] Lỗi gọi chi tiết:", error);
        setMatchDetailsData(null);
      } finally {
        setIsDetailsLoading(false);
      }
    };

    fetchMatchDetails();
  }, [selectedMatch, activeTab]);


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
          
          <div className="flex items-center gap-1.5 mt-0.5 ml-2">
             <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'LIVE API' ? 'bg-[#4ade80] animate-pulse' : 'bg-amber-500'}`}></div>
             <span className="text-[9px] font-bold text-[#a1a1aa] uppercase tracking-widest truncate max-w-[120px]">
               {apiStatus}
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
              
              {isStandingsLoading && (
                <div className="absolute inset-0 bg-[#222226]/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-[3px] border-[#4ade80] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {currentStandings.map((team, idx) => {
                let rankColor = 'text-[#71717a] font-medium';
                if (team.pos <= 4) rankColor = 'text-[#4ade80] font-bold';
                
                return (
                  <div key={idx} className="flex items-center px-5 py-3.5 hover:bg-white/5 transition-colors cursor-pointer group">
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
  
  const CalendarView = () => { return <div className="h-full bg-[#18181b] p-20 text-white text-center pt-32">Calendar View</div> };
  const ProfileView = () => { return <div className="h-full bg-[#18181b] p-20 text-white text-center pt-32">Profile View</div> };


  // ==============================================================
  // 6. MÀN HÌNH CHI TIẾT TRẬN ĐẤU
  // ==============================================================
  const MatchDetailView = () => {
    if (!selectedMatch) return null;
    
    // Sửa lỗi ReferenceError bằng cách định nghĩa colorA và colorB ở đây
    const colorA = getColor(selectedMatch?.teamA);
    const colorB = getColor(selectedMatch?.teamB);
    
    const parseLineupGrid = (apiStartXI, isHome) => {
      if (!apiStartXI || apiStartXI.length === 0) return isHome ? mockTeamALineup : mockTeamBLineup; 
      
      const rows = {};
      apiStartXI.forEach(item => {
          if(!item.player.grid) return;
          const [y, x] = item.player.grid.split(':');
          if(!rows[y]) rows[y] = [];
          rows[y].push({ ...item.player, x: Number(x) });
      });

      const parsedLineup = [];
      const rowKeys = Object.keys(rows).sort((a,b) => Number(a) - Number(b)); 
      const totalRows = rowKeys.length;

      rowKeys.forEach((y, rowIdx) => {
          rows[y].sort((a,b) => a.x - b.x); 
          const colsInRow = rows[y].length;
          rows[y].forEach((player, colIdx) => {
              let top = isHome ? 90 - (rowIdx * (70/(totalRows-1 || 1))) : 10 + (rowIdx * (70/(totalRows-1 || 1)));
              if (y === '1') top = isHome ? 90 : 10; 
              let left = 50;
              if (colsInRow > 1) {
                  const step = 60 / (colsInRow - 1);
                  left = 20 + (colIdx * step);
              }
              parsedLineup.push({ id: player.id, name: player.name.split(' ').pop(), number: player.number, top: `${top}%`, left: `${left}%` });
          });
      });
      return parsedLineup;
    };

    let currentStatsData = mockStatsData;
    let possA = 50, possB = 50;
    let cornersA = 0, cornersB = 0;
    let yellowsA = 0, yellowsB = 0;
    
    if (matchDetailsData && matchDetailsData.statistics && matchDetailsData.statistics.length === 2) {
      const statsA = matchDetailsData.statistics[0].statistics;
      const statsB = matchDetailsData.statistics[1].statistics;
      const getStat = (arr, t) => { 
        const item = arr.find(s=>s.type===t); 
        if(!item || item.value === null) return 0;
        if(typeof item.value === 'string' && item.value.includes('%')) return parseInt(item.value);
        return parseInt(item.value); 
      };

      currentStatsData = [
        { label: 'Số cú sút', a: getStat(statsA, 'Total Shots'), b: getStat(statsB, 'Total Shots') },
        { label: 'Sút trúng đích', a: getStat(statsA, 'Shots on Goal'), b: getStat(statsB, 'Shots on Goal') },
        { label: 'Kiểm soát (%)', a: getStat(statsA, 'Ball Possession'), b: getStat(statsB, 'Ball Possession'), format: '%' },
        { label: 'Chuyền bóng', a: getStat(statsA, 'Total passes'), b: getStat(statsB, 'Total passes') },
        { label: 'Phạt góc', a: getStat(statsA, 'Corner Kicks'), b: getStat(statsB, 'Corner Kicks') },
        { label: 'Phạm lỗi', a: getStat(statsA, 'Fouls'), b: getStat(statsB, 'Fouls') },
        { label: 'Thẻ vàng', a: getStat(statsA, 'Yellow Cards'), b: getStat(statsB, 'Yellow Cards') },
      ];
      possA = getStat(statsA, 'Ball Possession') || 50;
      possB = 100 - possA;
      cornersA = getStat(statsA, 'Corner Kicks'); cornersB = getStat(statsB, 'Corner Kicks');
      yellowsA = getStat(statsA, 'Yellow Cards'); yellowsB = getStat(statsB, 'Yellow Cards');
    }

    let currentLineupA = mockTeamALineup;
    let currentLineupB = mockTeamBLineup;
    let formA = '4-3-3', formB = '4-3-3';
    if (matchDetailsData && matchDetailsData.lineups && matchDetailsData.lineups.length === 2) {
        formA = matchDetailsData.lineups[0].formation || '-';
        formB = matchDetailsData.lineups[1].formation || '-';
        currentLineupA = parseLineupGrid(matchDetailsData.lineups[0].startXI, true);
        currentLineupB = parseLineupGrid(matchDetailsData.lineups[1].startXI, false);
    }

    const venue = matchDetailsData?.fixture?.venue?.name || 'Sân vận động chính';
    const referee = matchDetailsData?.fixture?.referee || 'Trọng tài chính';
    const htScoreHome = matchDetailsData?.score?.halftime?.home;
    const htScoreAway = matchDetailsData?.score?.halftime?.away;
    const htScoreString = (htScoreHome !== null && htScoreHome !== undefined) ? `HT ${htScoreHome} - ${htScoreAway}` : 'HT 0 - 0';

    let coachA = matchDetailsData?.lineups?.[0]?.coach?.name || '-';
    let coachB = matchDetailsData?.lineups?.[1]?.coach?.name || '-';
    let subsA = matchDetailsData?.lineups?.[0]?.substitutes || [];
    let subsB = matchDetailsData?.lineups?.[1]?.substitutes || [];

    let currentEvents = mockTimelineEvents;
    if (matchDetailsData && matchDetailsData.events) {
       currentEvents = matchDetailsData.events.map((ev, idx) => {
           const isHome = ev.team.id === matchDetailsData.teams.home.id;
           let evType = 'info';
           if (ev.type === 'Goal') evType = 'goal';
           if (ev.type === 'Card' && ev.detail === 'Yellow Card') evType = 'yellow_card';
           if (ev.type === 'Card' && ev.detail.includes('Red')) evType = 'red_card';
           if (ev.type === 'subst') evType = 'sub';

           return {
               id: idx,
               time: `${ev.time.elapsed}'${ev.time.extra ? `+${ev.time.extra}` : ''}`,
               type: evType,
               player: ev.player.name,
               playerIn: ev.type === 'subst' ? ev.assist.name : null,
               playerOut: ev.type === 'subst' ? ev.player.name : null,
               detail: ev.type === 'Goal' ? ev.detail : (evType === 'yellow_card' ? 'Phạm lỗi' : ''),
               side: isHome ? 'left' : 'right',
               isRecent: false
           };
       });
    }

    const isUpcoming = ['Sắp đá', 'Ngày mai', 'NS'].includes(selectedMatch.status);

    const getEventIcon = (type) => {
      if (type === 'goal') return <div className="text-[12px] drop-shadow-sm">⚽</div>;
      if (type === 'yellow_card') return <div className="w-2.5 h-3.5 bg-yellow-400 rounded-[1px] shadow-sm"></div>;
      if (type === 'red_card') return <div className="w-2.5 h-3.5 bg-red-500 rounded-[1px] shadow-sm"></div>;
      if (type === 'sub') return <ArrowRightLeft size={12} className="text-red-400" />;
      return null;
    }

    return (
      <div className="flex flex-col h-full bg-[#18181b] text-zinc-100 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-28 pt-10 relative">
        {isDetailsLoading && <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#27272a] px-3 py-1 rounded-full text-[10px] text-zinc-400 font-bold flex items-center gap-2 z-50 shadow-lg"><div className="w-3 h-3 border-2 border-[#f59e0b] border-t-transparent rounded-full animate-spin"></div> Đang tải...</div>}

        <div className="flex justify-between items-center px-4 pb-6">
          <div className="w-[75px] flex justify-start">
            <button onClick={() => setActiveTab('schedule')} className="w-8 h-8 flex items-center justify-start text-zinc-300 active:scale-95">
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="flex flex-col items-center flex-1">
             <div className="flex items-center justify-center gap-4 w-full">
                <TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-9 h-9 drop-shadow-lg" />
                
                <div className="bg-[#1c1c1e] border border-white/5 px-3 py-1 rounded-xl text-[16px] font-black tracking-widest text-white shadow-inner flex items-center justify-center min-w-[70px] whitespace-nowrap">
                  {selectedMatch.score}
                </div>
                
                <TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-9 h-9 drop-shadow-lg" />
             </div>
             
             <span className="text-[11px] font-bold text-[#4ade80] uppercase tracking-widest mt-2.5 flex items-center gap-1.5">
                {selectedMatch.isLive && <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse"></span>}
                {selectedMatch.isLive 
                    ? (matchDetailsData?.fixture?.status?.elapsed ? `${matchDetailsData.fixture.status.elapsed}'` : selectedMatch.status) 
                    : (htScoreString ? htScoreString : selectedMatch.status)}
             </span>
          </div>

          <div className="w-[75px] flex justify-end">
          </div>
        </div>

        <div className="flex gap-2.5 px-4 pb-4 mt-2 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden">
          {[
            { id: 'Chi tiết', icon: AlignLeft },
            { id: 'Đội hình', icon: Users },
            { id: 'AI dự đoán', icon: Cpu },
            { id: 'Thông số', icon: BarChart2 }
          ].map(t => {
            const isActive = selectedMatchTab === t.id;
            const Icon = t.icon;
            return (
              <button 
                key={t.id} onClick={() => setSelectedMatchTab(t.id)} 
                className={`shrink-0 snap-start flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${isActive ? 'bg-[#332616] text-[#f59e0b] border border-[#f59e0b]/50' : 'bg-[#222226] text-[#a1a1aa] border border-transparent hover:text-white'}`}
              >
                <Icon size={14} /> {t.id}
              </button>
            )
          })}
        </div>

        <div className="flex-1 px-4 min-h-[400px]">
          
          {selectedMatchTab === 'Chi tiết' && (
            <div className="flex flex-col gap-4">
              
              {isUpcoming && !matchDetailsData?.events ? (
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2.5 py-3 border-b border-[#27272a]">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[#71717a]"><Home size={12}/><span className="text-[10px] font-bold uppercase tracking-wider">Sân vận động</span></div>
                         <span className="text-[11px] font-bold text-white">{venue}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[#71717a]"><User size={12}/><span className="text-[10px] font-bold uppercase tracking-wider">Trọng tài</span></div>
                         <span className="text-[11px] font-bold text-white">{referee}</span>
                       </div>
                    </div>

                    <div className="py-4 border-b border-[#27272a]">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[13px] font-black" style={{color: colorA}}>2 Thắng</span>
                          <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider">Đối đầu</span>
                          <span className="text-[13px] font-black" style={{color: colorB}}>1 Thắng</span>
                       </div>
                       <div className="flex h-1.5 gap-1 mb-4">
                         <div className="flex-1 bg-[#27272a] rounded-full overflow-hidden"><div className="h-full float-right" style={{width: '40%', backgroundColor: colorA}}></div></div>
                         <div className="flex-[0.5] bg-[#3f3f46] rounded-full overflow-hidden"></div>
                         <div className="flex-1 bg-[#27272a] rounded-full overflow-hidden"><div className="h-full float-left" style={{width: '20%', backgroundColor: colorB}}></div></div>
                       </div>
                       
                       <div className="flex gap-2.5 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden pb-1 justify-center">
                         {mockH2HList.map((score, i) => (
                            <div key={i} className="snap-start shrink-0 flex items-center justify-center gap-2 bg-[#1c1c1e] px-2.5 py-1.5 rounded-lg border border-[#27272a]">
                              <TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-[11px] font-bold text-white">{score}</span>
                              <TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-3.5 h-3.5 shrink-0" />
                            </div>
                         ))}
                       </div>
                    </div>

                    <div className="py-4">
                       <h3 className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mb-3 text-center">Phong độ gần đây</h3>
                       <div className="flex flex-col gap-3">
                         <div className="flex items-center gap-3">
                            <TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-6 h-6 shrink-0 drop-shadow-md" />
                            <div className="flex items-center gap-2 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden pb-1">
                              {mockRecentA.map((m, i) => (
                                 <div key={i} className="snap-start shrink-0 flex items-center gap-1.5 bg-[#1c1c1e] h-7 px-2.5 rounded-md border border-[#27272a]">
                                   <span className={`text-[11px] font-black ${m.res==='W'?'text-[#4ade80]':m.res==='D'?'text-[#a1a1aa]':'text-red-500'}`}>{m.res}</span>
                                   <span className="text-[11px] font-bold text-white">{m.score}</span>
                                   <TeamLogo src={getLogo(m.opp)} className="w-4 h-4 shrink-0" />
                                 </div>
                              ))}
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-6 h-6 shrink-0 drop-shadow-md" />
                            <div className="flex items-center gap-2 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden pb-1">
                              {mockRecentB.map((m, i) => (
                                 <div key={i} className="snap-start shrink-0 flex items-center gap-1.5 bg-[#1c1c1e] h-7 px-2.5 rounded-md border border-[#27272a]">
                                   <span className={`text-[11px] font-black ${m.res==='W'?'text-[#4ade80]':m.res==='D'?'text-[#a1a1aa]':'text-red-500'}`}>{m.res}</span>
                                   <span className="text-[11px] font-bold text-white">{m.score}</span>
                                   <TeamLogo src={getLogo(m.opp)} className="w-4 h-4 shrink-0" />
                                 </div>
                              ))}
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>
              ) : (
                <>
                  <div className="bg-[#1c1c1e] rounded-[20px] p-4 flex flex-col gap-4 shadow-sm">
                     <h3 className="text-[12px] font-medium text-[#71717a] text-center">Kiểm soát bóng</h3>
                     <div className="flex items-center gap-3">
                        <TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-5 h-5 shrink-0" />
                        <div className="flex-1 flex h-6 rounded-md overflow-hidden text-[11px] font-bold text-white shadow-inner">
                           <div className="bg-[#1d4ed8] h-full flex items-center justify-end px-2 transition-all" style={{width: `${possA}%`}}>{possA}%</div>
                           <div className="bg-[#d97706] h-full flex items-center justify-start px-2 transition-all" style={{width: `${possB}%`}}>{possB}%</div>
                        </div>
                        <TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-5 h-5 shrink-0" />
                     </div>
                     <div className="flex justify-center items-center gap-6 mt-1">
                        <div className="flex items-center gap-2.5 bg-[#18181b] px-4 py-1.5 rounded-full">
                           <span className="text-[11px] font-bold text-white">{cornersA}</span>
                           <Flag size={12} className="text-[#a1a1aa] fill-current" />
                           <span className="text-[11px] font-bold text-white">{cornersB}</span>
                        </div>
                        <div className="flex items-center gap-2.5 bg-[#18181b] px-4 py-1.5 rounded-full">
                           <span className="text-[11px] font-bold text-white">{yellowsA}</span>
                           <div className="w-2.5 h-3.5 bg-yellow-400 rounded-sm"></div>
                           <span className="text-[11px] font-bold text-white">{yellowsB}</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#1c1c1e] rounded-[20px] p-5">
                    <div className="relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#3f3f46] -translate-x-1/2"></div>
                      
                      <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                         <div className="bg-[#18181b] border border-[#3f3f46] px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-md">
                           {htScoreString}
                         </div>
                         <span className="text-[9px] text-[#a1a1aa] mt-1 bg-[#1c1c1e] px-1">+ 3 phút bù giờ</span>
                      </div>

                      {currentEvents.length === 0 ? (
                         <div className="text-center py-4 text-[#71717a] text-[11px]">Chưa có sự kiện nào</div>
                      ) : (
                        currentEvents.map((ev, i) => (
                           <div key={i} className="grid grid-cols-[1fr_40px_1fr] items-center mb-5 relative z-10">
                              
                              <div className="flex items-center justify-end gap-2.5 pr-2">
                                 {ev.side === 'left' && (
                                    <>
                                      <div className="flex flex-col items-end">
                                         <span className="text-[12px] font-medium text-white">{ev.player}</span>
                                         <span className="text-[10px] text-[#71717a]">{ev.detail}</span>
                                      </div>
                                      {getEventIcon(ev.type)}
                                    </>
                                 )}
                              </div>
                              
                              <div className="flex justify-center">
                                 <span className="text-[10px] text-[#a1a1aa] bg-[#1c1c1e] py-1 px-1 font-medium">{ev.time}</span>
                              </div>

                              <div className="flex items-center justify-start gap-2.5 pl-2">
                                 {ev.side === 'right' && (
                                    <>
                                      {getEventIcon(ev.type)}
                                      <div className="flex flex-col items-start">
                                         <span className="text-[12px] font-medium text-white">{ev.player}</span>
                                         <span className="text-[10px] text-[#71717a]">{ev.detail}</span>
                                      </div>
                                    </>
                                 )}
                              </div>
                           </div>
                        ))
                      )}

                      <div className="flex flex-col items-center justify-center mt-6 relative z-10">
                         <div className="bg-[#18181b] border border-[#3f3f46] px-3 py-1 rounded-full text-[10px] font-medium text-[#a1a1aa] shadow-md">
                           Bắt đầu trận
                         </div>
                         <div className="flex items-center gap-1 text-[8px] text-[#71717a] mt-2">
                           <Activity size={10} className="text-green-500" />
                           Hiển thị/ẩn sự kiện trên dòng thời gian
                         </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {selectedMatchTab === 'Đội hình' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2"><TeamLogo src={selectedMatch.logoA || getLogo(selectedMatch.teamA)} className="w-5 h-5" /><div className="flex flex-col"><span className="text-[12px] font-bold text-white truncate max-w-[100px]">{selectedMatch.teamA}</span><span className="text-[9px] text-[#f59e0b] font-semibold">{formA}</span></div></div>
                <div className="flex items-center gap-2 flex-row-reverse"><TeamLogo src={selectedMatch.logoB || getLogo(selectedMatch.teamB)} className="w-5 h-5" /><div className="flex flex-col items-end"><span className="text-[12px] font-bold text-white truncate max-w-[100px]">{selectedMatch.teamB}</span><span className="text-[9px] text-[#f59e0b] font-semibold">{formB}</span></div></div>
              </div>
              
              <div className="relative w-full aspect-[2/3] bg-[#064e3b] rounded-[16px] overflow-hidden shadow-inner border-[3px] border-[#18181b]">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_10%,rgba(0,0,0,0.1)_10%,rgba(0,0,0,0.1)_20%)] pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-white/40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-[1.5px] border-white/40 rounded-full"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-[16%] border-[1.5px] border-white/40 border-t-0"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[25%] h-[6%] border-[1.5px] border-white/40 border-t-0"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[16%] border-[1.5px] border-white/40 border-b-0"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[6%] border-[1.5px] border-white/40 border-b-0"></div>
              
                {currentLineupB.map((player) => (
                  <div key={player.id} className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform cursor-pointer" style={{ top: player.top, left: player.left }}>
                    <span className="text-[7px] font-bold text-[#18181b] mb-0.5 shadow-sm bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded leading-none truncate max-w-[45px] text-center">{player.name}</span>
                    <div className="w-[24px] h-[24px] shrink-0 rounded-full flex items-center justify-center text-[10px] font-black leading-none shadow-md bg-white border border-[#a1a1aa] text-[#18181b]">{player.number}</div>
                  </div>
                ))}
                {currentLineupA.map((player) => (
                  <div key={player.id} className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform cursor-pointer" style={{ top: player.top, left: player.left }}>
                    <div className="w-[24px] h-[24px] shrink-0 rounded-full flex items-center justify-center text-[10px] font-black leading-none shadow-md bg-[#18181b] border border-[#3f3f46] text-white">{player.number}</div>
                    <span className="text-[7px] font-bold text-white mt-0.5 shadow-sm bg-[#18181b]/95 backdrop-blur-sm px-1.5 py-0.5 rounded border border-[#3f3f46] leading-none truncate max-w-[45px] text-center">{player.name}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#1c1c1e] rounded-[16px] p-4 flex gap-4 mt-2">
                 <div className="flex-1 flex flex-col">
                    <h4 className="text-[10px] font-bold text-[#71717a] uppercase mb-1.5">HLV: <span className="text-white normal-case">{coachA}</span></h4>
                    <div className="flex flex-col">
                       {subsA.slice(0, 5).map((sub, i) => (
                         <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#27272a] last:border-0">
                           <span className="text-[10px] font-medium text-[#71717a] w-4 text-right">{sub.player.number || '-'}</span>
                           <span className="text-[11px] font-medium text-zinc-300 truncate">{sub.player.name}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="w-[1px] bg-[#27272a]"></div>
                 <div className="flex-1 flex flex-col items-end">
                    <h4 className="text-[10px] font-bold text-[#71717a] uppercase mb-1.5">HLV: <span className="text-white normal-case">{coachB}</span></h4>
                    <div className="flex flex-col w-full">
                       {subsB.slice(0, 5).map((sub, i) => (
                         <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#27272a] last:border-0 flex-row-reverse">
                           <span className="text-[10px] font-medium text-[#71717a] w-4 text-left">{sub.player.number || '-'}</span>
                           <span className="text-[11px] font-medium text-zinc-300 truncate text-right">{sub.player.name}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {selectedMatchTab === 'AI dự đoán' && (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <Cpu size={40} className="text-[#3f3f46] mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Tính năng đang phát triển</h3>
                <p className="text-[11px] text-[#71717a] max-w-[200px]">Trí tuệ nhân tạo sẽ sớm cập nhật dự đoán kết quả cho trận đấu này.</p>
             </div>
          )}

          {selectedMatchTab === 'Thông số' && (
            <div className="bg-[#1c1c1e] rounded-[20px] p-5 flex flex-col gap-4">
               {isUpcoming && !matchDetailsData?.statistics ? (
                 <div className="text-center py-8 text-[#71717a] text-[11px] font-medium">Trận đấu chưa bắt đầu.</div>
               ) : currentStatsData.length === 0 ? (
                 <div className="text-center py-8 text-[#71717a] text-[11px] font-medium">Không có dữ liệu thống kê.</div>
               ) : (
                 currentStatsData.map((stat, idx) => {
                   const total = stat.a + stat.b;
                   const pctA = total === 0 ? 50 : (stat.a / total) * 100;
                   const pctB = total === 0 ? 50 : (stat.b / total) * 100;
                   return (
                     <div key={idx} className="flex flex-col gap-1.5">
                       <div className="flex justify-between items-center text-[12px] font-medium">
                         <span className={`w-8 font-bold ${stat.a >= stat.b ? 'text-[#1d4ed8]' : 'text-[#71717a]'}`}>{stat.a}{stat.format === '%' ? '%' : ''}</span>
                         <span className="text-[#a1a1aa] text-center flex-1">{stat.label}</span>
                         <span className={`w-8 font-bold text-right ${stat.b >= stat.a ? 'text-[#d97706]' : 'text-[#71717a]'}`}>{stat.b}{stat.format === '%' ? '%' : ''}</span>
                       </div>
                       <div className="flex h-1.5 gap-1">
                         <div className="flex-1 bg-[#27272a] rounded-full flex justify-end overflow-hidden"><div className={`h-full rounded-full transition-all ${stat.a >= stat.b ? 'bg-[#1d4ed8]' : 'bg-[#1d4ed8]/40'}`} style={{ width: `${pctA}%` }}></div></div>
                         <div className="flex-1 bg-[#27272a] rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${stat.b >= stat.a ? 'bg-[#d97706]' : 'bg-[#d97706]/40'}`} style={{ width: `${pctB}%` }}></div></div>
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
              const Icon = tab.icon;

              return (
                <button 
                  key={tab.id} onClick={() => setActiveTab(tab.id)} 
                  className={`relative flex flex-col items-center justify-center w-[64px] h-[46px] transition-all duration-300 rounded-[20px] ${isActive ? 'bg-[#213f31]' : ''}`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`mb-1 ${isActive ? 'text-[#4ade80]' : 'text-[#71717a]'}`} />
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