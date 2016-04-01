package models

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"github.com/yhat/scrape"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

type Site struct {
	Name string `json:"site"`
}

type Data struct {
	Sites []Site `json:"sites"`
	//Total int
}

type Results struct {
	Data Data
}

type Result struct {
	//Request json.RawMessage
	Results Results
}

func Nerdy(query, apikey string) (response string, err error) {
	//query = "_pop.push(['siteId', 1966])"
	//apikey = "3494295cca774568004dc9dd5d6b916f"

	q, err := url.Parse(query)
	query = q.String()
	var url = "https://nerdyapi.com/v2/code/search?andCode%5B%5D=" + query + "&api_key=" + apikey + "&count=10&offset=0&raw=true&year=2016"

	resp, err := http.Get(url)
	if err != nil {
		return
	}

	defer resp.Body.Close()

	/*result, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}

	log.Println(string(result))*/

	decoder := json.NewDecoder(resp.Body)
	var res Result
	err = decoder.Decode(&res)

	if err != nil {
		return
	}

	for _, v := range res.Results.Data.Sites {
		response += v.Name + " "
	}

	return
}

func crawl2(url string, r *regexp.Regexp) (response string, err error) {

	resp, err := http.Get(url)
	if err != nil {
		return
	}

	b := resp.Body
	defer b.Close()

	result, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}

	match := r.FindStringSubmatch(string(result))
	if len(match) > 0 {
		url = url + ":" + strings.Join(match, ":")
	}

	response = url
	return
}

func crawl(url string, r *regexp.Regexp, ch chan string, ch_finished chan bool) {

	resp, err := http.Get(url)
	log.Println(url)
	defer func() {
		// Notify that we're done after this function
		ch_finished <- true
	}()
	if err != nil {
		ch <- "Failed to crawl: " + url
		return
	}

	b := resp.Body
	defer b.Close()

	result, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		ch <- "Failed to read: " + url
		return
	}

	match := r.FindStringSubmatch(string(result))
	if len(match) > 0 {
		url = url + ":" + strings.Join(match, ":")
	}

	ch <- url

	return
}

func Process7() (response interface{}, err error) {
	var res []string
	var pattern = `_pop\.push\(\[['"]siteId['"], ([\w]+)\]\)`
	urls := []string{
		"http://pinoytambayanseries.be",
		"http://member.ascentso.com",
		"http://www.adultotube.com.br",
	}

	r, err := regexp.Compile(pattern)
	if err != nil {
		return
	}

	for _, url := range urls {
		result, _ := crawl2(url, r)
		res = append(res, result)
	}

	response = res
	return
}

// 1. get the url
// 2. regexp the whole source
// 3. if not found, get the external js files
// 4. crawl to those js files
// 5. regexp the js files
// 6. stop if found
// 7. return string url,siteid
func Process(url, pattern string) (response interface{}, err error) {
	resp, err := http.Get(url)
	if err != nil {
		return
	}
	defer resp.Body.Close()

	r, err := regexp.Compile(pattern)
	if err != nil {
		return
	}

	result, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}

	match := r.FindStringSubmatch(string(result))
	if len(match) > 0 {
		//response = url + "," + match[1]
		response = match
	}

	return
}

func ProcessOrig() (response interface{}, err error) {
	var pattern = `_pop\.push\(\[['"]siteId['"], ([\w]+)\]\)`
	urls := []string{
		//"http://pinoytambayanseries.be",
		"http://member.ascentso.com",
		//"http://www.adultotube.com.br",
	}

	res := make(map[string]bool)
	ch_urls := make(chan string)
	ch_finished := make(chan bool)

	r, err := regexp.Compile(pattern)
	if err != nil {
		return
	}

	// Kick off the crawl process concurrently
	for _, url := range urls {
		go crawl(url, r, ch_urls, ch_finished)
	}

	// Subscribe to both channels
	for c := 0; c < len(urls); {
		select {
		case url := <-ch_urls:
			res[url] = true
		case <-ch_finished:
			c++
		}
	}

	response = res

	close(ch_urls)
	return
}

func Process__() (response interface{}, err error) {
	var url = "http://member.ascentso.com"

	resp, err := http.Get(url)
	if err != nil {
		return
	}

	root, err := html.Parse(resp.Body)
	defer resp.Body.Close()

	if err != nil {
		return
	}

	scripts := scrape.FindAll(root, scrape.ByTag(atom.Script))

	for _, script := range scripts {
		log.Println(scrape.Attr(script, "src"))
	}

	response = "test"

	return
}

func Process2() (response interface{}, err error) {
	var url = "http://member.ascentso.com"
	var pattern = `_pop\.push\(\[['"]siteId['"], ([\w]+)\]\)`
	var site = `Thequickbslirek_pop.push(['siteId', 34s]);ierkjsldjf`
	var pattern2 = `<script .+`

	r, err := regexp.Compile(pattern)
	if err != nil {
		return
	}

	r2, err := regexp.Compile(pattern2)
	if err != nil {
		return
	}

	match := r.FindStringSubmatch(site)

	resp, err := http.Get(url)
	if err != nil {
		return
	}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}

	match2 := r2.FindAllStringSubmatch(string(b), -1)

	resp.Body.Close()

	response = match2
	log.Println(match)

	return
}
