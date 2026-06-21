import * as cheerio from "cheerio";
export class WebScraperTool {
  USER_AGENT = "Mozilla/5.0 (compatible; JobOutreachBot/1.0; +https://github.com/joboutreach)";
  MAX_CONTENT_LENGTH = 5e4;
  TIMEOUT_MS = 1e4;
  async scrape(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.USER_AGENT,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        },
        signal: controller.signal,
        redirect: "follow"
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const html = await response.text();
      return this.extractText(html, url);
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(`Timeout scraping ${url}`);
      }
      throw new Error(`Failed to scrape ${url}: ${error.message}`);
    }
  }
  extractText(html, url) {
    const $ = cheerio.load(html);
    $("script, style, nav, footer, header, iframe, noscript, svg, img").remove();
    $('[class*="cookie"], [class*="banner"], [class*="popup"], [class*="modal"]').remove();
    $('[class*="sidebar"], [class*="advertisement"], [class*="ad-"]').remove();
    let content = "";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("linkedin.com")) {
      content = this.extractLinkedIn($);
    } else if (lowerUrl.includes("naukri.com")) {
      content = this.extractNaukri($);
    } else if (lowerUrl.includes("internshala.com")) {
      content = this.extractInternshala($);
    } else {
      content = this.extractGeneric($);
    }
    if (content.length < 100) {
      content = $("body").text();
    }
    content = content.replace(/\s+/g, " ").replace(/\n\s*\n/g, "\n").trim();
    return content.substring(0, this.MAX_CONTENT_LENGTH);
  }
  extractLinkedIn($) {
    const parts = [];
    const selectors = [
      ".job-details",
      ".description__text",
      ".show-more-less-html",
      ".jobs-description",
      ".jobs-box__html-content",
      "article",
      ".top-card-layout",
      "main"
    ];
    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text.length > 50) {
        parts.push(text);
      }
    }
    const title = $("h1").first().text().trim() || $("title").text().trim();
    if (title) parts.unshift(`Job Title: ${title}`);
    return parts.join("\n\n");
  }
  extractNaukri($) {
    const parts = [];
    const selectors = [
      ".job-desc",
      ".jd-container",
      ".other-details",
      ".key-skills",
      ".job-details",
      ".styles_JDC__dang-inner-html__h0K4t",
      "section.styles_job-desc-container__txpYf",
      "main"
    ];
    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text.length > 30) {
        parts.push(text);
      }
    }
    const title = $("h1").first().text().trim() || $("title").text().trim();
    if (title) parts.unshift(`Job Title: ${title}`);
    return parts.join("\n\n");
  }
  extractInternshala($) {
    const parts = [];
    const selectors = [
      ".internship_details",
      ".detail_view",
      ".about_company_text_container",
      ".individual_internship",
      "#about_company",
      ".stipend_container",
      "main"
    ];
    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text.length > 30) {
        parts.push(text);
      }
    }
    const title = $("h1").first().text().trim() || $("title").text().trim();
    if (title) parts.unshift(`Job/Internship Title: ${title}`);
    return parts.join("\n\n");
  }
  extractGeneric($) {
    const parts = [];
    const selectors = [
      '[class*="job-description"]',
      '[class*="job-detail"]',
      '[class*="posting"]',
      '[class*="position"]',
      '[class*="career"]',
      '[class*="vacancy"]',
      "article",
      "main",
      '[role="main"]'
    ];
    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text.length > 50) {
        parts.push(text);
      }
    }
    const title = $("h1").first().text().trim() || $("title").text().trim();
    if (title) parts.unshift(`Title: ${title}`);
    if (parts.length <= 1) {
      parts.push($("body").text().trim());
    }
    return parts.join("\n\n");
  }
}
