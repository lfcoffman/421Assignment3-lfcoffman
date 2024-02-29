using (WebClient wc = new WebClient())
{
    //fake like you are a "real" web browser
    wc.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)");
    json = wc.DownloadString("https://www.reddit.com/search.json?limit=100&q="+ HttpUtility.UrlEncode(queryText));
}
var textToExamine = new List<string>();
JsonDocument doc = JsonDocument.Parse(json);

// Navigate to the "data" object
JsonElement dataElement = doc.RootElement.GetProperty("data");

// Navigate to the "children" array
JsonElement childrenElement = dataElement.GetProperty("children");
foreach (JsonElement child in childrenElement.EnumerateArray())
{
    if (child.TryGetProperty("data", out JsonElement data))
    {
        if (data.TryGetProperty("selftext", out JsonElement selftext))
        {
            string selftextValue = selftext.GetString();
            if(!string.IsNullOrEmpty(selftextValue)){ textToExamine.Add(selftextValue); }
            else if (data.TryGetProperty("title", out JsonElement title)) //use title if text is empty
            {
                string titleValue = title.GetString();
                if (!string.IsNullOrEmpty(titleValue)) { textToExamine.Add(titleValue); }
            }
        }
    }
}