package utils

import (
	"database/sql"
	"strings"
	"time"

	"github.com/lib/pq"
)

func ToNullString(s string) sql.NullString {
	return sql.NullString{String: s, Valid: strings.Trim(s, " ") != ""}
}

func ToNullInt64(i int64) sql.NullInt64 {
	return sql.NullInt64{Int64: i, Valid: i != 0}
}

func ToNullTime(t time.Time, valid bool) pq.NullTime {
	return pq.NullTime{Time: t, Valid: valid}
}

func ParseDate(form, d string) (pd time.Time, err error) {
	pd, err = time.Parse(form, d)
	if err != nil {
		return
	}

	return
}

// returns the UTC date fr, and to
func GetDatesToday() (fr, to time.Time, err error) {
	var SHORTFORM = "2006-01-02"

	utc := time.Now().UTC()

	// load location
	loc, err := time.LoadLocation("Asia/Manila")
	if err != nil {
		return
	}

	// get the date today in current location
	today := utc.In(loc).Format(SHORTFORM) // this returns string date, removes the time

	fr, err = ParseDate(SHORTFORM, today) // this returns date with time 0:00
	if err != nil {
		return
	}

	fr = fr.Add(time.Hour * -8) // '2016-01-28 16:00'
	to = fr.Add(time.Hour * 24) // 2016-01-29 16:00

	return
}

func RemoveDuplicates(elements []int) []int {
	// Use map to record duplicates as we find them.
	encountered := map[int]bool{}
	result := []int{}

	for v := range elements {
		if !encountered[elements[v]] {
			// Record this element as an encountered element.
			encountered[elements[v]] = true
			// Append the result slice.
			result = append(result, elements[v])
		}
	}

	// return the new slice
	return result
}
