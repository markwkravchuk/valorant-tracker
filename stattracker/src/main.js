import { ValorantAPI } from './classes/ValorantAPI.js';
import { MEB } from './classes/MEB.js';
import { UserInterface } from './classes/UserInterface.js';

async function main() {
  try {
    const api_key = "YOUR API KEY HERE";

    const urlParameters = getQueryParameters();
    const username = urlParameters.username;
    const tagline = urlParameters.tagline;

    const UI = new UserInterface();

    UI.updateElementContent('titleOfResults', `${username}'s stats`);

    const valorantAPI = new ValorantAPI();

    const account = await valorantAPI.getAccountFromUsernameAndTagline(username, tagline, api_key);
    const player_puuid = account.data.puuid;
    const level  = account.data.account_level;
    console.log(player_puuid);

    const matches = await valorantAPI.getMatchesWithPuuid(player_puuid, api_key);
    const mmr = await valorantAPI.getMMRWithPuuid(player_puuid, api_key);
    const characters = await valorantAPI.getCharacters();
    const rank_icons = await valorantAPI.getRankIcons();
    const maps = await valorantAPI.getMaps();
    
    const playerDataContainer = {
      puuid: player_puuid,
      currentRank: mmr.current_data.currenttierpatched,
      currentRankAsTier:  mmr.current_data.currenttier,
      peakRank: mmr.highest_rank.patched_tier,
      peakRankAsTier: mmr.highest_rank.converted,
      currentRankPoints: mmr.current_data.ranking_in_tier,
      playerCard: account.data.card.small,
      currentRankImg: mmr.current_data.images.small,
    };

    const matchDataContainer= {
      matches: [],
      totalShots: 0,
      totalHeadshots: 0,
      totalBodyshots: 0,
      totalLegshots: 0,
      totalKills: 0,
      totalAssists: 0,
      totalDeaths: 0,
      addMatch : function(match) {
        this.matches.push(match);
      },
    };

    // CREATE THE MATCHES
    const matchHistoryContainer = document.getElementById('match-history-container');
    const matchElementBuilder = new MEB(characters);
    matchElementBuilder.processAllMatches(matches, matchDataContainer, maps);

    const gamemodeDropdown = document.getElementById('gamemode-selector');

    gamemodeDropdown.addEventListener('change', function() {

      const gamemodeToDisplay = gamemodeDropdown.value;
      let matchesOfType = [];
      if (gamemodeToDisplay === 'all') {
        matchesOfType = matchDataContainer.matches;
      } else {
        matchesOfType = matchDataContainer.matches.filter(match => {
          return match.gamemode === gamemodeToDisplay;
        });
      }
      UI.createMatchElements(matchesOfType, matchElementBuilder, matchHistoryContainer);

      let visibleMatchCount = 10;
      const matchesPerLoad = 10;
      const loadMoreButton = document.getElementById('load-more-button');
      const allMatches = document.querySelectorAll('.match');
      // Hide all matches beyond the initially visible ones
      allMatches.forEach((match, index) => {
        if (index >= visibleMatchCount) {
          match.style.display = 'none';
        }
      });

      function loadMoreMatches() {
        for (let i = visibleMatchCount; i < visibleMatchCount + matchesPerLoad; i++) {
          if (allMatches[i]) {
            allMatches[i].style.display = 'inherit';
          }
        }
        visibleMatchCount += matchesPerLoad;
      
        // Hide the "Load More" button if all matches are visible
        if (visibleMatchCount >= allMatches.length) {
          loadMoreButton.style.display = 'none';
        }
      }

      loadMoreButton.addEventListener('click', loadMoreMatches);


    });
    gamemodeDropdown.dispatchEvent(new Event('change'));


    // CALCULATE DESIRED INFO SUCH AS SHOT PERCENTAGES
    const totalMatches = matchDataContainer.matches.length;
    const headshot_percentage = calculateShotPercentage(matchDataContainer.totalHeadshots, matchDataContainer.totalShots);
    const bodyshot_percentage = calculateShotPercentage(matchDataContainer.totalBodyshots, matchDataContainer.totalShots);
    const legshot_percentage = calculateShotPercentage(matchDataContainer.totalLegshots, matchDataContainer.totalShots);

    // UPDATE ALL OF THAT DESIRED INFO ONTO THE PAGE
    UI.updateElementContent('headshot-percentage', headshot_percentage);
    UI.updateElementContent('bodyshot-percentage', bodyshot_percentage);
    UI.updateElementContent('legshot-percentage', legshot_percentage);
    UI.updateElementContent('currentRank', playerDataContainer.currentRank);
    UI.updateElementContent('peakRank', playerDataContainer.peakRank);
    UI.updateElementContent('username', username);
    UI.updateElementContent('tagline', tagline);
    UI.updateElementContent('puuid', player_puuid);
    UI.updateElementContent('totalGames', totalMatches);
    UI.updateElementContent('level', level);
    UI.updateElementContent('current-rank-number', `${playerDataContainer.currentRankPoints} RR`);

    // PROFILE PIC
    const profileIcon = document.getElementById('profile-icon');
    profileIcon.style.backgroundImage = `url(${playerDataContainer.playerCard})`;

    // CURRENT RANK ICON
    const currRankIcon = document.getElementById('current-rank-icon');
    currRankIcon.style.backgroundImage = `url(${playerDataContainer.currentRankImg})`;

    // PEAK RANK ICON
    const peakRankIcon = document.getElementById('peak-rank-icon');
    const peakRankAsTier = playerDataContainer.peakRankAsTier;
    peakRankIcon.style.backgroundImage = `url(${rank_icons[rank_icons.length - 1].tiers[peakRankAsTier].smallIcon})`;

    // LOAD MORE FUNCTIONALITY
  }

  catch(error)
  {
    console.error(error);
  }
}










main();











function getQueryParameters() {
  const queryParameters = new URLSearchParams(window.location.search);
  return Object.fromEntries(queryParameters.entries());
}

function calculateShotPercentage(totalXshots, totalShots) {
  return (totalXshots/totalShots).toFixed(2);
}
