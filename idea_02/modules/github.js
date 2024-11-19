const axios = require('axios');

async function fetchTrendingRepositories(language = 'javascript') {
    try {
        console.log('DEBUG: Starting GitHub Trending API request...');
        
        // GitHub Trending API endpoint
        const response = await axios.get('https://api.gitterapp.com/repositories', {
            params: {
                language: language,
                since: 'daily'
            }
        });

        console.log('DEBUG: Trending API response status:', response.status);
        
        if (response.data && Array.isArray(response.data)) {
            return response.data
                .slice(0, 10) // Limit to top 10 repositories
                .map((repo, index) => 
                    `${index + 1}. [${repo.author}/${repo.name}](${repo.url})\n` +
                    `⭐ Stars: ${repo.stars} | 🔄 Forks: ${repo.forks}\n` +
                    `📝 ${repo.description || 'No description'}\n`
                )
                .join('\n');
        }
        return null;
    } catch (error) {
        console.error('DEBUG: Trending API Error:', error.message);
        console.error('DEBUG: Full error:', error.response?.data || error);
        return null;
    }
}

module.exports = {
    fetchTrendingRepositories
};
