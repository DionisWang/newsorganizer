require("babel-register")({
  presets: ["es2015", "react"]
});
 
const router = require("./src/components/app/sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

function generateSitemap() {
    return (
      new Sitemap(router)
          .build("https://news-organizer.herokuapp.com/")
          .save("./public/sitemap.xml")
    );
}

generateSitemap();