// ============ Simple Local DB (no server) ============
window.DB = (() => {
  const KEY = "mentor_chess_v1";

  function _load(){
    try{
      return JSON.parse(localStorage.getItem(KEY)) || { users: {}, activeUser: null };
    }catch(e){
      return { users: {}, activeUser: null };
    }
  }
  function _save(db){ localStorage.setItem(KEY, JSON.stringify(db)); }

  function ensureUser(username){
    const db = _load();
    if(!db.users[username]){
      db.users[username] = {
        username,
        createdAt: Date.now(),
        stats: {
          streak: 1,
          xp: 0,
          puzzlesRating: 700,
          puzzlesSolved: 0,
          guidedWins: 0,
          gamesPlayed: 0
        },
        mastery: {}
      };
    }
    db.activeUser = username;
    _save(db);
    return db.users[username];
  }

  function getActiveUser(){
    const db = _load();
    if(!db.activeUser) return null;
    return db.users[db.activeUser] || null;
  }

  function setActiveUser(username){
    const db = _load();
    db.activeUser = username;
    if(!db.users[username]) db.users[username] = ensureUser(username);
    _save(db);
  }

  function updateUser(mutator){
    const db = _load();
    const u = (db.activeUser && db.users[db.activeUser]) ? db.users[db.activeUser] : null;
    if(!u) return;
    // normalize
    u.stats = u.stats || {};
    u.mastery = u.mastery || {};
    mutator(u);
    db.users[db.activeUser] = u;
    _save(db);
  }

  function awardXP(amount, bucket){
    updateUser(u => {
      u.stats.xp = (u.stats.xp || 0) + amount;
      if(bucket){
        u.mastery[bucket] = (u.mastery[bucket] || 0) + amount;
      }
    });
  }

  function getRankName(xp){
    if(xp >= 1200) return "Mestre";
    if(xp >= 700) return "Avançado";
    if(xp >= 300) return "Intermediário";
    return "Iniciante";
  }

  return {
    ensureUser,
    getActiveUser,
    setActiveUser,
    updateUser,
    awardXP,
    getRankName
  };
})();
