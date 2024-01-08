export class ValorantAPI {

  async getAccountFromUsernameAndTagline(username, tagline, apiKey) {
    const apiURL = `https://api.henrikdev.xyz/valorant/v1/account/${encodeURI(username)}/${encodeURI(tagline)}`;
    const headers = {
      Authorization: apiKey,
      method: 'GET',
    }
  
    try {
      const response = await fetch(apiURL, {headers});
  
      if (!response.ok) {
        throw new Error('API request failed');
      }
  
      const datajson = await response.json();
      return datajson;
  
    } catch(error) {
      console.error('API Request Error', error);
      return null;
    }
  }
  
  async getMatchesWithPuuid(puuid, apiKey) {
    const apiURL = `https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/na/${puuid}`;
    const headers = {
      Authorization: apiKey,
      method: 'GET',
    }
    
    try {
      const response = await fetch(apiURL, {headers})
  
      if(!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      const matchesJson = await response.json();
      return matchesJson.data;
  
    } catch (error) {
      console.error('API request error SAJ', error);
    }
  
  }
  
  async getMMRWithPuuid(puuid, apiKey) {
    const apiURL = `https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/na/${puuid}`
    const headers = {
      Authorization: apiKey,
      method: 'GET',
    }
    
    try {
      const response = await fetch(apiURL, {headers})
  
      if(!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      const mmrJson = await response.json();
      return mmrJson.data;
  
    } catch (error) {
      console.error('API request error SAJ', error);
    }
  }
  
  async getRankIcons() {
    const apiURL = `https://valorant-api.com/v1/competitivetiers`;
    const headers = {method: 'GET',}
  
    try {
      const response = await fetch(apiURL, {headers});
  
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      const rankIconsJson = await response.json();
      return rankIconsJson.data;
  
    } catch (error) {
      console.error('API request error SAJ', error);
    }
  }

  async getCharacters() {
    const apiURL = `https://valorant-api.com/v1/agents`;
    const headers = {method: 'GET',}
  
    try {
      const response = await fetch(apiURL, {headers});
  
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      const characterJson = await response.json();
      return characterJson.data;
  
    } catch (error) {
      console.error('API request error SAJ', error);
    }
  }

  async getMaps() {
    const apiURL = `https://valorant-api.com/v1/maps`;
    const headers = {method: 'GET',}
  
    try {
      const response = await fetch(apiURL, {headers});
  
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      const mapsJson = await response.json();
      return mapsJson.data;
  
    } catch (error) {
      console.error('API request error SAJ', error);
    }
  }
  
}