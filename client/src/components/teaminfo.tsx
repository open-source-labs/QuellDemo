import Nick from '../assets/images/new_profile_pics/Nick-Kruckenberg.jpeg';
import Mike from '../assets/images/new_profile_pics/Mike-Lauri.jpeg';
import Rob from '../assets/images/new_profile_pics/Rob-Nobile.jpeg';
import Justin from '../assets/images/new_profile_pics/Justin-Jaeger.jpeg';
import Andrei from '../assets/images/new_profile_pics/Andrei-Cabrera.jpeg';
import Dasha from '../assets/images/new_profile_pics/Dasha-Kondratenko.jpeg';
import Derek from '../assets/images/new_profile_pics/Derek-Sirola.jpeg';
import Xiao from '../assets/images/new_profile_pics/Xiao-Yu-Omeara.jpeg';
import Robleh from '../assets/images/new_profile_pics/Robleh-Farah.jpeg';
import Thomas from '../assets/images/new_profile_pics/Thomas-Reeder.jpeg';
import Angela from '../assets/images/new_profile_pics/Angela-Franco.jpeg';
import Ken from '../assets/images/new_profile_pics/Ken-Litton.jpeg';
import Jinhee from '../assets/images/new_profile_pics/Jinhee-Choi.jpeg';
import Nayan from '../assets/images/new_profile_pics/Nayan-Parmar.jpeg';
import Tash from '../assets/images/new_profile_pics/Tashrif-Sanil.png';
import Tim from '../assets/images/new_profile_pics/Tim-Frenzel.jpeg';
import Chang from '../assets/images/new_profile_pics/Chang-Ca.jpeg';
import Josh from '../assets/images/new_profile_pics/Josh-Jordan.jpeg';
import Robert from '../assets/images/new_profile_pics/Robert-Howton.jpeg';
import DavidLopez from '../assets/images/new_profile_pics/David-Lopez.jpeg';
import IdanMichael from '../assets/images/new_profile_pics/Idan-Michael.jpeg';
import SercanTuna from '../assets/images/new_profile_pics/Sercan-Tuna.jpeg';
import ThomasPryor from '../assets/images/new_profile_pics/Thomas-Pryor.jpeg';
import ZoeH from '../assets/images/new_profile_pics/Zoe-Harper.jpeg';
import JackieHe from '../assets/images/new_profile_pics/Jackie-He.jpeg';
import CeraB from '../assets/images/new_profile_pics/Cera-Barrow.jpeg';
import AlexMartinez from '../assets/images/new_profile_pics/Alexander-Martinez.jpeg';
import RylanW from '../assets/images/new_profile_pics/Rylan-Wessel.jpeg';
import SarahC from '../assets/images/new_profile_pics/Sarah-Cynn.jpeg';
import HannahS from '../assets/images/new_profile_pics/Hannah-Spencer.jpeg';
import KatieS from '../assets/images/new_profile_pics/Katie-Sandfort.jpeg';
import Garik from '../assets/images/new_profile_pics/Garik-Asplund.jpeg';
import AngeloC from '../assets/images/new_profile_pics/Angelo-Chengcuenca.jpeg';
import EmilyH from '../assets/images/new_profile_pics/Emily-Hoang.jpeg';
import KeelyT from '../assets/images/new_profile_pics/Keely-Timms.jpeg';
import YusufB from '../assets/images/new_profile_pics/Yusuf-Bhaiyat.jpeg';
import JonahW from '../assets/images/new_profile_pics/Jonah-Weinbaum.jpg';
import LennyL from '../assets/images/new_profile_pics/Lenny-Yambao.jpeg';
import JustinH from '../assets/images/new_profile_pics/Justin-Hua.jpeg';
import MichaelL from '../assets/images/new_profile_pics/Michael-Lav.jpeg';
import Andrew from '../assets/images/new_profile_pics/Andrew-Dai.jpeg';
import Stacey from '../assets/images/new_profile_pics/Stacey-Lee.jpeg';
import Ian from '../assets/images/new_profile_pics/Ian-Weinholtz.jpeg';
import Cassidy from '../assets/images/new_profile_pics/Cassidy-Komp.jpeg';

/* 
  Reusable component to generate each team member
*/

const ANDREWD = {
  name: 'Andrew Dai',
  src: Andrew,
  bio: 'coconut juice',
  linkedin: 'https://www.linkedin.com/in/andrewmdai/',
  github: 'https://github.com/andrewmdai',
};
const STACEYL = {
  name: 'Stacey Lee',
  src: Stacey,
  bio: 'coconut juice',
  linkedin: 'https://www.linkedin.com/in/stacey-lee-136298147/',
  github: 'https://github.com/staceyjhlee',
};
const IANW = {
  name: 'Ian Weinholtz',
  src: Ian,
  bio: 'coconut juice',
  linkedin: 'https://www.linkedin.com/in/ian-weinholtz/',
  github: 'https://github.com/itsHackinTime',
};
const CASSIDYK = {
  name: 'Cassidy Komp',
  src: Cassidy,
  bio: 'coconut juice',
  linkedin: 'https://www.linkedin.com/in/cassidy-komp-a400ab148/',
  github: 'https://github.com/mimikomp',
};
const JONAHW = {
  name: 'Jonah Weinbaum',
  src: JonahW,
  bio: 'coconut juice',
  linkedin: 'https://www.linkedin.com/in/jonah-weinbaum/',
  github: 'https://github.com/jonahpw',
};
const LENNYL = {
  name: 'Lenny Yambao',
  src: LennyL,
  bio: 'Angelo is a dynamic full-stack engineer that specializes in React, Express, TypeScript, and GraphQL. His goal for Quell was to achieve type safety across the entire codebase to create an application that was more maintainable and less susceptible to silent errors from type coercion. In his free time, Angelo likes going on long walks with his loyal companions, Barry and Bonnie, playing pickup basketball, and watching movies or tv shows with his partner.',
  linkedin: 'https://www.linkedin.com/in/lenny-yambao/',
  github: 'https://github.com/lennin6',
};
const JUSTINH = {
  name: 'Justin Hua',
  src: JustinH,
  bio: 'Angelo is a dynamic full-stack engineer that specializes in React, Express, TypeScript, and GraphQL. His goal for Quell was to achieve type safety across the entire codebase to create an application that was more maintainable and less susceptible to silent errors from type coercion. In his free time, Angelo likes going on long walks with his loyal companions, Barry and Bonnie, playing pickup basketball, and watching movies or tv shows with his partner.',
  linkedin: 'https://www.linkedin.com/in/justinfhua/',
  github: 'https://github.com/justinfhua',
};
const MICHAELL = {
  name: 'Michael Lav',
  src: MichaelL,
  bio: 'Angelo is a dynamic full-stack engineer that specializes in React, Express, TypeScript, and GraphQL. His goal for Quell was to achieve type safety across the entire codebase to create an application that was more maintainable and less susceptible to silent errors from type coercion. In his free time, Angelo likes going on long walks with his loyal companions, Barry and Bonnie, playing pickup basketball, and watching movies or tv shows with his partner.',
  linkedin: 'https://www.linkedin.com/in/michael-lav/',
  github: 'https://github.com/mikelav258',
};
const ANGELOC = {
  name: 'Angelo Chengcuenca',
  src: AngeloC,
  bio: 'Angelo is a dynamic full-stack engineer that specializes in React, Express, TypeScript, and GraphQL. His goal for Quell was to achieve type safety across the entire codebase to create an application that was more maintainable and less susceptible to silent errors from type coercion. In his free time, Angelo likes going on long walks with his loyal companions, Barry and Bonnie, playing pickup basketball, and watching movies or tv shows with his partner.',
  linkedin: 'https://www.linkedin.com/in/angelotmchengcuenca/',
  github: 'https://github.com/amchengcuenca',
};
const EMILYH = {
  name: 'Emily Hoang',
  src: EmilyH,
  bio: "Emily is a dedicated full-stack developer with a strong background in JavaScript, React, and Node.js. She is dedicated to building efficient and innovative applications that improve users' lives. In her free time, Emily enjoys traveling around the world, listening to audiobooks, and exploring new restaurants and cuisines.",
  linkedin: 'https://www.linkedin.com/in/emilyhoang',
  github: 'https://www.github.com/emilythoang',
};
const KEELYT = {
  name: 'Keely Timms',
  src: KeelyT,
  bio: "Full-stack developer proficient in React, SQL, and TypeScript. Detail-oriented problem solver passionate about impactful applications. Enjoys snowboarding, baking, and spending time with her cats.",
  linkedin: 'https://www.linkedin.com/in/keelyt/',
  github: 'https://github.com/keelyt',
};
const YUSUFB = {
  name: 'Yusuf Bhaiyat',
  src: YusufB,
  bio: "Yusuf Bhaiyat is a full-stack developer with a strong background in React and Node.js He is dedicated to building efficient and innovative applications that improve users' lives. Yusuf is an active member of the tech community, frequently attending hackathons and meetups to learn and collaborate with other professionals. In his free time, he loves to travel and immerse himself in new cultures and experiences.",
  linkedin: 'https://www.linkedin.com/in/yusufbhaiyat/',
  github: 'https://github.com/yusuf-bha',
};
const KATIES = {
  name: 'Katie Sandfort',
  src: KatieS,
  bio: 'Katie is an analytical and creative full-stack developer who loves discussing the pros and cons of different cache eviction policies. Specializing in JavaScript (ES6+), TypeScript, and React, she loves creating applications that help solve problems in her community. When she’s not busy creating applications, she loves running with her dog and listening to audiobooks.',
  linkedin: 'https://www.linkedin.com/in/katie-sandfort/',
  github: 'https://github.com/katiesandfort',
};
const HANNAHS = {
  name: 'Hannah Spencer',
  src: HannahS,
  bio: 'Hannah is an intuitive software engineer with a passion for debugging. Her goal for Quell is to ensure that Quell exceeds expectations in terms of functionality and is easily navigable by future contributors. Outside of the realm of Quell and software development, she enjoys hiking to discover waterfalls, modern dance, and wire wrapping gemstones.',
  linkedin: 'https://www.linkedin.com/in/hannahspen/',
  github: 'https://github.com/Hannahspen',
};
const SARAHCYNN = {
  name: 'Sarah Cynn',
  src: SarahC,
  bio: 'Sarah is an empathetic full-stack developer who specializes in React, Node, and GraphQL, and she values collaboration with other software developers to create meaningful and helpful developer tools. In her free time, Sarah enjoys baking bread, learning music production, and playing with her baby niece.',
  linkedin: 'https://www.linkedin.com/in/cynnsarah/',
  github: 'https://github.com/cynnsarah',
};
const GARIKASPLUND = {
  name: 'Garik Asplund',
  src: Garik,
  bio: 'Garik is a full-stack developer who loves new frameworks and runtimes! He also has a special spot for databases in all their variety. He is an avid backcountry skier and trailrunner who lives in rural northeast Oregon with his two cats, Wasabi and Ginger, and dog, Noodle.',
  linkedin: 'https://www.linkedin.com/in/garik-asplund/',
  github: 'https://github.com/garikAsplund',
};
const RYLANWESSEL = {
  name: 'Rylan Wessel',
  src: RylanW,
  bio: 'Rylan is a determined software engineer that loves working with other developers sharing a passion for creating a better community with efficient and effective software applicatios, like Quell! I love playing videogames and going for hikes in the mountains in my free time, but also coding and contributing to the open-source community.',
  linkedin: 'https://www.linkedin.com/in/rylan-wessel',
  github: 'https://github.com/XpIose',
};
const CERABARROW = {
  name: 'Cera Barrow',
  src: CeraB,
  bio: 'Cera is a full-stack developer specializing in React and Node with a passion for combining efficiency with style. She lives in Seattle with her four Gameboy Advances on the off-chance that anyone wants to come over and play Final Fantasy: Crystal Chronicles.',
  linkedin: 'http://www.linkedin.com/in/cerabarrow/',
  github: 'https://github.com/cerab',
};
const JACKIEHE = {
  name: 'Jackie He',
  src: JackieHe,
  bio: 'Jackie is a full-stack software engineer with experience in React, Material UI, and graphQL. His goal with Quell was to create a tool that would optimize both performance and security for graphQL developers. In his free time, he loves quickscoping on COD and grinding woodcutting on Runescape.',
  linkedin: 'https://www.linkedin.com/in/jackie-he/',
  github: 'https://github.com/Jckhe',
};
const ALEXANDERMARTINEZ = {
  name: 'Alexander Martinez',
  src: AlexMartinez,
  bio: 'Alexander is a full-stack software engineer specializing in React, Node.js, and GraphQL. He is passionate about creating efficiencies in data fetching, creating meaningful products, and contributing to the open-source community. In his off time, he enjoys playing Dota 2, rock climbing, playing with his cavapoo named Basil, and trying new sushi restaurants.',
  linkedin: 'https://www.linkedin.com/in/alexander-martinez415/',
  github: 'https://github.com/alexmartinez123',
};
const ZOEHARPER = {
  name: 'Zoe Harper',
  src: ZoeH,
  bio: 'Zoe is a full-stack software engineer with a passion for all things JavaScript. She desired Quell to be a viable and modern product and worked hard to migrate dependencies and fix logic. In her spare time she is huge ARPG nerd.',
  linkedin: 'https://www.linkedin.com/in/harperzoe/',
  github: 'https://github.com/ContraireZoe',
};
const DAVIDLOPEZ = {
  name: 'David Lopez',
  src: DavidLopez,
  bio: "David is a fullstack software engineer with experience in React,Redux, GraphQL, Node.JS and Express. He takes pride in the software engineering community's culture of knowledge sharing and collaboration. When he is not at his desk, he’s probably in the garage, working on one of his project cars, brewing beer, or in the kitchen pursuing that perfect bowl of ramen.",
  linkedin: 'http://www.linkedin.com/in/david-michael-lopez/',
  github: 'https://github.com/DavidMPLopez',
};
const IDANMICHAEL = {
  name: 'Idan Michael',
  src: IdanMichael,
  bio: 'Idan is a full-stack software engineer with experience in Express, React and several database models. His goal with Quell is to scale the caching algorithms to create a more thorough caching platform. In his free time he likes to practice Brazilian Jiu Jitsu and watch movies.',
  linkedin: 'https://www.linkedin.com/in/idanmichael/',
  github: 'https://github.com/IdanMichael',
};
const SERCANTUNA = {
  name: 'Sercan Tuna',
  src: SercanTuna,
  bio: 'Sercan is a full stack software engineer specializing in React , Nodejs ,Express and GraphQl . He has particular interest in user interface and performance optimization , and passionate about contributing to the open-source community . In his spare time , he can be found playing tennis , watching soccer and traveling .',
  linkedin: 'https://www.linkedin.com/in/sercantuna/',
  github: 'https://github.com/srcntuna',
};
const THOMASPRYOR = {
  name: 'Thomas Pryor',
  src: ThomasPryor,
  bio: 'Tom Pryor is a software engineer who also enjoys playing guitar and video games in between coding full-stack projects! Everything from Express on the back end to React on the front end!',
  linkedin: 'https://www.linkedin.com/in/thomas-pryor-639347b2',
  github: 'https://github.com/Turmbeoz',
};
const ROBERTHOWTON = {
  name: 'Robert Howton',
  src: Robert,
  bio: 'Robert is a software engineer with experience in React, Node.js/Express, and several database models (relational, document, and key-value). He believes in the importance of open-source software and strives to make contributions with clean, optimized, and maintainable code. When not at work, he can be found reading philosophy or science fiction, traveling to ancient sites, or sampling lesser-known varietals.',
  linkedin: 'https://www.linkedin.com/in/roberthowton/',
  github: 'https://github.com/roberthowton',
};
const CHANGCAI = {
  name: 'Chang Cai',
  src: Chang,
  bio: 'Chang is a full-stack developer specializing in React and Node.js, with a passion for frontend development and optimization. He is passionate about all things engineering whether the medium is code, wood, 3D filaments and resins, fabric or otherwise.  He’s a natural born tinkerer with endless curiosity, always seeking new things to learn and new skills to master.',
  linkedin: 'https://www.linkedin.com/in/chang-c-cai/',
  github: 'https://github.com/ccai89',
};
const JOSHJORDAN = {
  name: 'Josh Jordan',
  src: Josh,
  bio: 'Josh is a full-stack software engineer specializing in Express and Redis, with a passion for exploring the cross-sections of database management and system design. When he is not working, Josh can be found reading Shogun, practicing yoga, cooking delicious meals for his wife, and participating in Dionysian mysteries.',
  linkedin: 'https://www.linkedin.com/in/josh-r-jordan/',
  github: 'https://github.com/jjordan-90',
};
const JINHEECHOI = {
  name: 'Jinhee Choi',
  src: Jinhee,
  bio: 'Jinhee is a full-stack software engineer specializing in React, Node.js, Express, relational databases, non-relational databases, graphQL, with a passion for cache invalidation and implementing performant client-side caching storage. Jinhee enjoys visiting local attraction places with his wife and follows New York Yankees.',
  linkedin: 'https://www.linkedin.com/in/jinheekchoi/',
  github: 'https://github.com/jcroadmovie',
};
const NAYANPARMAR = {
  name: 'Nayan Parmar',
  src: Nayan,
  bio: 'Nayan is a full-stack software engineer specializing in React, Express, relational database, with a passion for contributing to open-source code. He has strong interest in performance optimization and front-end tech. In his free time, Nayan enjoys watching a variety of movies, and always try to find interesting books to read.',
  linkedin: 'https://www.linkedin.com/in/nparmar1/',
  github: 'https://github.com/nparmar1',
};
const TASHRIFSANIL = {
  name: 'Tashrif Sanil',
  src: Tash,
  bio: 'Tash is a full-stack software engineer specializing in Node.js, C++, Redis, GraphQL, with a passion for performance optimization. His goal with Quell is to improve server side cache retrieval response time and cache invalidation. In his free time, he likes to practice latte art.',
  linkedin: 'https://www.linkedin.com/in/tashrif-sanil-5a499415b/',
  github: 'https://github.com/tashrifsanil',
};
const TIMFRENZIL = {
  name: 'Tim Frenzel',
  src: Tim,
  bio: 'Tim is a passionate database and system engineer with a strong desire to learn and work on scalable and non-linear systems that ultimately allow him to take deeper dives into data analytics. Hence, he focused primarily on performance questions like caching strategies, batching, and in-memory databases. Outside of engineering time, Tim is working on his meme mastery, travels across the globe, and develops investment algos.',
  linkedin: 'https://www.linkedin.com/in/tim-frenzel-mba-cfa-frm-61a35499/',
  github: 'https://github.com/TimFrenzel',
};
const ROBLEHFARAH = {
  name: 'Robleh Farah',
  src: Robleh,
  bio: 'Robleh is a full-stack software engineer specializing in React, Express, and relational databases, with a passion for code dependability, optimization, and test driven development. His devotion to open-source projects, and strong interest in GraphQL, makes him an ideal candidate for Quell. Outside of coding, Robleh enjoys hiking, tea collecting, and volunteering in developing countries abroad.',
  linkedin: 'https://www.linkedin.com/in/farahrobleh/',
  github: 'https://github.com/farahrobleh',
};
const THOMASREEDER = {
  name: 'Thomas Reeder',
  src: Thomas,
  bio: 'Thomas is a full-stack JavaScript engineer specializing in React and Node.js, and always wishes he had more time to write tests. His goal with Quell is maintaining a consistent, modular codebase to make future development simple and enjoyable. In his free time he can be found trying to bake pastries, or singing ABBA songs at karaoke.',
  linkedin: 'https://www.linkedin.com/in/thomas-reeder/',
  github: 'https://github.com/nomtomnom',
};
const ANGELAFRANCO = {
  name: 'Angela Franco',
  src: Angela,
  bio: 'Angela is a full-stack software engineer experienced in React and Express, with a passion for code reliability and testing. She has a particular interest in exploring innovative technologies to build tools that make the world a better place. Outside of coding, Angela is a travel and hospitality enthusiast and a Soccer World Cup fanatic.',
  linkedin: 'https://www.linkedin.com/in/angela-j-franco/',
  github: 'https://github.com/ajfranco18',
};
const KENLITTON = {
  name: 'Ken Litton',
  src: Ken,
  bio: 'Ken is a full-stack JavaScript software engineer with a passion for test driven development and recursive algorithms. He cares deeply about sharing what he learns through open-source projects and making the world a more open-minded place to live. Outside of coding, Ken is an avid reader of classical fiction, psychological studies, and hip-hop lyrics.',
  linkedin: 'https://www.linkedin.com/in/ken-litton/',
  github: 'https://github.com/kenlitton',
};
const ANDREICABRERAO = {
  name: 'Andrei Cabrera',
  src: Andrei,
  bio: 'Andrei Cabrera is a full-stack JavaScript engineer with a particular interest in user interaction and website performance. specializing in React and Express with a focus in server protocols. He is passionate about open-source projects, refactoring code and testing. Dedicate to his family and friends.',
  linkedin: 'https://www.linkedin.com/in/andrei-cabrera-00324b146/',
  github: 'https://github.com/Andreicabrerao',
};
const DASHAKONDRATENKO = {
  name: 'Dasha Kondratenko',
  src: Dasha,
  bio: "Dasha is a full-stack software engineer experienced in JavaScript. She is passionate about code readability, open-source projects and believes in technology's ability to be a force for good. Outside of programming, she is dedicated to her two dogs.",
  linkedin: 'https://www.linkedin.com/in/dasha-k/',
  github: 'https://github.com/dasha-k',
};
const DEREKSIROLA = {
  name: 'Derek Sirola',
  src: Derek,
  bio: 'Derek is a full-stack JavaScript engineer with a particular interest for React, Redux, and Express. His passion for community-developed open-source projects makes him an exceptional candidate for Quell. Outside of coding, Derek is an avid piano player and an enthusiastic hiker.',
  linkedin: 'https://www.linkedin.com/in/dsirola1/',
  github: 'https://github.com/dsirola1',
};
const XIAOYUOMEARA = {
  name: 'Xiao Yu Omeara',
  src: Xiao,
  bio: 'Xiao is a full-stack software engineer with a passion for maximizing performance and resiliency. Xiao also cares deeply about maintainable code, automated testing, and community-driven open-source projects. Outside of coding, Xiao is a Pilates and indoor rowing enthusiast.',
  linkedin: 'https://www.linkedin.com/in/xyomeara/',
  github: 'https://github.com/xyomeara',
};
const NICKKRUCKENBERG = {
  name: 'Nick Kruckenberg',
  src: Nick,
  bio: 'Nick Kruckenberg is a full-stack software engineer with a particular interest in systems design. He is passionate about ed tech, community-driven open-source projects, readable code, and technology’s potential to solve problems and do good -- a central topic of his teaching and research as a lecturer in philosophy.',
  linkedin: 'https://www.linkedin.com/in/nicholaskruckenberg/',
  github: 'https://github.com/kruckenberg',
};
const MIKELAURI = {
  name: 'Mike Lauri',
  src: Mike,
  bio: 'Mike Lauri is a full-stack JavaScript engineer specializing in React and Node.js.  His passion for open source projects, as well as his interest in the inner workings of GraphQL, made Quell a perfect fit.  Prior to Quell, Mike worked as a songwriter and producer in New York City, best known for his work with WWE Music Group.',
  linkedin: 'https://www.linkedin.com/in/mlauri/',
  github: 'https://github.com/MichaelLauri',
};
const ROBNOBILE = {
  name: 'Rob Nobile',
  src: Rob,
  bio: 'Rob Nobile is a full-stack JavaScript engineer specializing in React and Express with a focus in front-end performance optimization and server-side data transfer protocols.  Additional concentrations in tech include auth, testing and SQL.  Prior to Quell, Rob was a Frontend Engineer at EmpowerED Group, Inc. dedicated to the E-learning music space and remains an active contributor.',
  linkedin: 'https://www.linkedin.com/in/robnobile/',
  github: 'https://github.com/RobNobile',
};
const JUSTINJAEGAR = {
  name: 'Justin Jaeger',
  src: Justin,
  bio: 'Justin Jaeger is a full-stack software engineer, passionate about designing and building performant user interfaces.  Outside of programming, he loves reviewing films and obsessing over Oscar predictions.',
  linkedin: 'https://www.linkedin.com/in/justin-jaeger-81a805b5/',
  github: 'https://github.com/justinjaeger',
};
export const TeamArr = [
  ANDREWD,
  STACEYL,
  IANW,
  CASSIDYK,
  JONAHW,
  LENNYL,
  JUSTINH,
  MICHAELL,
  ANGELOC,
  EMILYH,
  KEELYT,
  YUSUFB,
  KATIES,
  HANNAHS,
  SARAHCYNN,
  GARIKASPLUND,
  RYLANWESSEL,
  JACKIEHE,
  ALEXANDERMARTINEZ,
  CERABARROW,
  ZOEHARPER,
  DAVIDLOPEZ,
  IDANMICHAEL,
  SERCANTUNA,
  THOMASPRYOR,
  ROBERTHOWTON,
  CHANGCAI,
  JOSHJORDAN,
  JINHEECHOI,
  NAYANPARMAR,
  TASHRIFSANIL,
  TIMFRENZIL,
  ROBLEHFARAH,
  THOMASREEDER,
  ANGELAFRANCO,
  KENLITTON,
  ANDREICABRERAO,
  DASHAKONDRATENKO,
  DEREKSIROLA,
  XIAOYUOMEARA,
  NICKKRUCKENBERG,
  MIKELAURI,
  ROBNOBILE,
  JUSTINJAEGAR,
];
