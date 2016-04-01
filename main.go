package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/labstack/echo/middleware"
	"github.com/mewben/config-echo"
	"github.com/rs/cors"

	"projects/f8webscraper/controllers"
)

// Executed before main function
func init() {
	//port := env.GetPort()

	// setup config
	config.Setup("localhost:1313")
}

// Main entry point
func main() {
	// Echo Instance
	e := echo.New()

	// Echo Middleware
	e.Use(middleware.Recover())
	e.Use(middleware.Gzip())
	e.Use(middleware.Static("public"))

	if config.Mode == "dev" {
		e.SetDebug(true)
		e.Use(middleware.Logger())
		e.Use(standard.WrapMiddleware(cors.New(cors.Options{
			AllowedOrigins: []string{"*"},
		}).Handler))
	}

	/*
		e.Index("public/index.html")
		e.ServeFile("/*", "public/index.html")
		e.Static("/build", "public/build")
		e.Static("/assets", "public/assets")*/

	site := controllers.SiteController{}
	e.Post("/process", site.Process())
	e.Post("/nerdy", site.Nerdy())

	e.Run(standard.New(config.Port))
}
