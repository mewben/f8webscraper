package controllers

import (
	"github.com/labstack/echo"

	"projects/f8webscraper/models"
	"projects/f8webscraper/utils"
)

type SiteController struct{}

func (*SiteController) Process() echo.HandlerFunc {
	return func(c echo.Context) error {
		type pL struct {
			Url     string
			Pattern string
		}
		var payload pL

		if err := c.Bind(&payload); err != nil {
			return c.JSON(400, utils.ErrMarshal(err.Error()))
		}

		if ret, err := models.Process(payload.Url, payload.Pattern); err != nil {
			return c.JSON(400, utils.ErrMarshal(err.Error()))
		} else {
			return c.JSON(200, ret)
		}
	}
}

func (*SiteController) Nerdy() echo.HandlerFunc {
	return func(c echo.Context) error {
		type pL struct {
			Query  string
			ApiKey string
		}
		var payload pL

		if err := c.Bind(&payload); err != nil {
			return c.JSON(400, utils.ErrMarshal(err.Error()))
		}

		if ret, err := models.Nerdy(payload.Query, payload.ApiKey); err != nil {
			return c.JSON(400, utils.ErrMarshal(err.Error()))
		} else {
			return c.JSON(200, ret)
		}
	}
}
