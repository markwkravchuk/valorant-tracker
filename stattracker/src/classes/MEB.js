export class MEB {

  processAllMatches(matches, matchDataContainer, maps) {
    matches.forEach(match => {
      this.processMatch(match, matchDataContainer, maps);
    });
  }

  processMatch(match, matchDataContainer, maps) {
    const the_match = this.addMatchFromJson(match, maps);
    matchDataContainer.totalShots += the_match.headshots + the_match.bodyshots + the_match.legshots;
    matchDataContainer.totalHeadshots += the_match.headshots;
    matchDataContainer.totalBodyshots += the_match.bodyshots;
    matchDataContainer.totalLegshots += the_match.legshots;
    matchDataContainer.totalKills += the_match.kills;
    matchDataContainer.totalDeaths += the_match.deaths;
    matchDataContainer.totalAssists += the_match.assists;
    matchDataContainer.addMatch(the_match);
  }

  addMatchFromJson(matchData, maps) {
    const result = this.determineMatchResult(matchData);
    const roundsWon = this.selfRoundsWon(matchData);
    const roundsLost = this.enemyRoundsWon(matchData);
    const formatted_time = this.formatTime(matchData.meta.started_at);
    const mapName = matchData.meta.map.name;
    const mapIcon = this.getMapIcon(mapName, maps);
    const match = {
      kills: matchData.stats.kills,
      deaths: matchData.stats.deaths,
      assists: matchData.stats.assists,
      headshots: matchData.stats.shots.head,
      bodyshots: matchData.stats.shots.body,
      legshots: matchData.stats.shots.leg,
      map: mapName,
      character: matchData.stats.character.name,
      result: result,
      roundsWon: roundsWon,
      roundsLost: roundsLost,
      roundsTotal: roundsWon + roundsLost,
      score: matchData.stats.score,
      timeAgo: formatted_time,
      gamemode: matchData.meta.mode,
      mapIcon: mapIcon,
    }
    return match;
  }

  determineMatchResult(matchData) {
    const teamsData = matchData.teams;
    const playersTeam = matchData.stats.team.toLowerCase();
    let enemyTeam = 'white';
    if (playersTeam === 'red') {
      enemyTeam = 'blue';
    } else if (playersTeam === 'blue') {
      enemyTeam = 'red';
    }
  
    const playersRoundsWon = teamsData[playersTeam];
    const enemyRoundsWon = teamsData[enemyTeam];
  
    let result = 'draw';
    if (playersRoundsWon > enemyRoundsWon) {
      result = 'win';
    } else if (playersRoundsWon < enemyRoundsWon) {
      result = 'loss';
    }
    return result;
  }

  selfRoundsWon(matchData) {
    const teamsData = matchData.teams;
    const playersTeam = matchData.stats.team.toLowerCase();
    
    return teamsData[playersTeam];
  }
  
  enemyRoundsWon(matchData) {
    const teamsData = matchData.teams;
    const playersTeam = matchData.stats.team.toLowerCase();
  
    let enemyTeam = 'white';
    if (playersTeam === 'red') {
      enemyTeam = 'blue';
    } else if (playersTeam === 'blue') {
      enemyTeam = 'red';
    }
  
    return teamsData[enemyTeam];
  }

  formatTime(unformatted_time) {
    const timeOfMatch = new Date(unformatted_time).getTime();
    const timeNow = new Date().getTime();
    const timeDifference = timeNow - timeOfMatch;
  
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 12 * month;
  
    if (timeDifference < minute) {
      return 'Just now';
    } else if (timeDifference < hour) {
      const minsAgo = Math.floor(timeDifference / minute);
      return minsAgo === 1 ? '1 minute ago' : `${minsAgo} minutes ago`;
    } else if (timeDifference < day) {
      const hoursAgo = Math.floor(timeDifference / hour);
      return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
    } else if (timeDifference < week) {
      const daysAgo = Math.floor(timeDifference / day);
      return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
    } else if (timeDifference < month) {
      const weeksAgo = Math.floor(timeDifference / week);
      return weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`;
    } else if (timeDifference < year) {
      const monthsAgo = Math.floor(timeDifference / month);
      return monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
    } else {
      const yearsAgo = Math.floor(timeDifference / year);
      return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
    }
  }

  getMapIcon (mapName, maps) {
    let map_icon = '';
    for (let i = 0; i < maps.length; ++i) {
      if (maps[i].displayName === mapName) {
        map_icon = maps[i].listViewIcon;
      }
    }
    return map_icon;
  }

  constructor(characters) {
    this.characters = characters;
  }

  createMatchElement(the_match) {
    const matchWrapper = this.createDivWithClass('match');
    let matchElement = this.createDivWithClass(`match-result-${the_match.result}`);
    if (the_match.gamemode === "Deathmatch") {
      matchElement = this.createDivWithClass('match-result-win');
    }
    const content = this.createDivWithClass('content');

    // MATCH RESULT
    const matchResult = this.createDivWithClass('match-result');

    const summaryElement = this.createSummaryElement(the_match);
    const characterElement = this.createCharacterElement(the_match);
    const roundsEachElement = this.createRoundsEachElement(the_match);
    const statsElement = this.createStatsElement(the_match);
    const mapElement = this.createMapElement(the_match);

    matchResult.appendChild(summaryElement);
    matchResult.appendChild(characterElement);
    matchResult.appendChild(roundsEachElement);
    matchResult.appendChild(statsElement);
    matchResult.appendChild(mapElement);

    content.appendChild(matchResult);

    matchElement.appendChild(content);
    matchWrapper.appendChild(matchElement);
    return matchWrapper;
  }

  createDivWithClass(className, textContent = null) {
    const div = document.createElement('div');
    div.className = className;
    if (textContent !== null) {
      div.textContent = textContent;
    }
    return div;
  }

  createSummaryElement(the_match) {
    const summary = this.createDivWithClass('summary');
    const gamemode = this.createDivWithClass('gamemode', the_match.gamemode);
    const timeAgo = this.createDivWithClass('time-ago', the_match.timeAgo);
    const bar = this.createDivWithClass('bar');
    let result = this.createDivWithClass(`result-${the_match.result}`, the_match.result.toUpperCase());
    if (the_match.gamemode === "Deathmatch") {
      result = this.createDivWithClass('result-win', "WIN")
    }

    summary.appendChild(gamemode);
    summary.appendChild(timeAgo);
    summary.appendChild(bar);
    summary.appendChild(result);

    return summary;
  }

  createCharacterElement(the_match) {
    const character = this.createDivWithClass('character');

    // IMAGE FUNCTIONALITY
    const img = document.createElement('img');
    for (let i = 0; i < this.characters.length; i++) {
      if (the_match.character === this.characters[i].displayName) {
        img.src = this.characters[i].displayIconSmall;
        break;
      }
    }
    character.appendChild(img);
    return character;
  }

  createRoundsEachElement(the_match) {
    if (the_match.gamemode != "Deathmatch") {
      return this.createDivWithClass('rounds-each', `${the_match.roundsWon} : ${the_match.roundsLost}`);
    } else {
      return this.createDivWithClass('rounds-each', "0 : 0");
    }
  }

  createStatsElement(the_match) {
    const stats = this.createDivWithClass('stats');

      const KDA = this.createDivWithClass('KDA', `${the_match.kills} / ${the_match.deaths} / ${the_match.assists}`);
      const vertical_bar = this.createDivWithClass('vertical-bar');
      const detailedStats = this.createDetailedStatsElement(the_match);

      stats.appendChild(KDA);
      stats.appendChild(vertical_bar);
      stats.appendChild(detailedStats);

    return stats;
  }

  createMapElement(the_match) {
    const map = this.createDivWithClass('map');

      const mapImg = document.createElement('img');
        mapImg.className = 'map-background';
        mapImg.src = `${the_match.mapIcon}`;
      const mapName = this.createDivWithClass('map-name', `${the_match.map}`);

      map.appendChild(mapImg);
      map.appendChild(mapName);

    return map;
  }

  createDetailedStatsElement(the_match) {
    const detailedStats = this.createDivWithClass('detailed-stats');
    let HSP = 0;
    let ACS = 0;
    if (the_match.gamemode != "Deathmatch") {
      HSP = this.createDivWithClass('HSP', `HS%: ${calculateShotPercentage(the_match.headshots, the_match.headshots + the_match.bodyshots + the_match.legshots)}`);
      ACS = this.createDivWithClass('ACS', `ACS: ${Math.round(the_match.score/the_match.roundsTotal)}`);
    }
    const KDratio = this.createDivWithClass('KDratio', `KD: ${calculateShotPercentage(the_match.kills, the_match.deaths)}`);

    if (the_match.gamemode != "Deathmatch") {
      detailedStats.appendChild(HSP);
      detailedStats.appendChild(KDratio);
      detailedStats.appendChild(ACS);
    } else {
      detailedStats.appendChild(KDratio);
    }  
    return detailedStats;
  }
}

function calculateShotPercentage(totalXshots, totalShots) {
  return (totalXshots/totalShots).toFixed(2);
}
