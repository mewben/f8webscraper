package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/dchest/uniuri"
	"github.com/dgrijalva/jwt-go"
)

func GenerateJWTToken(signingkey string, tz int64, iss int) (res interface{}, err error) {

	type rT struct {
		Token string
		Exp   int64
	}

	var ret rT

	token := jwt.New(jwt.SigningMethodHS256)

	// set expiry
	tm := time.Unix(tz, 0)
	//exp := tm.Add(time.Second * 300) // 5 mins

	// 8 hours for dev
	exp := tm.Add(time.Second * 60 * 60 * 8)
	//exp := tm.Add(time.Second * 300)

	// set some Claims
	token.Header["typ"] = "JWT"
	token.Claims["iss"] = iss
	token.Claims["exp"] = exp.Unix()

	// Generate encoded token
	tokenString, err := token.SignedString([]byte(signingkey))
	if err != nil {
		return
	}

	ret.Token = tokenString
	ret.Exp = exp.UnixNano() / int64(time.Millisecond) // used in react time expiry

	res = ret
	return
}

// Generate 32bit token
func GenerateRandomToken() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

// Generate RegCode
// 3 letters + 3 numbers
func GenerateRegCode() string {
	uniuri.StdChars = []byte("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

	n := big.NewInt(899)
	r, _ := rand.Int(rand.Reader, n)

	digits := int(r.Int64()) + 100

	return uniuri.NewLen(4) + strconv.Itoa(digits)
}

// Slugify
func GenerateSlug(str string) (slug string) {
	return strings.Map(func(r rune) rune {
		switch {
		case r == ' ', r == '-':
			return '-'
		case r == '_', unicode.IsLetter(r), unicode.IsDigit(r):
			return r
		default:
			return -1
		}
		return -1
	}, strings.ToLower(strings.TrimSpace(str)))
}

func GenerateRandomId() int {
	n := big.NewInt(8609980)
	r, _ := rand.Int(rand.Reader, n)

	return int(r.Int64()) + 1200000
}
