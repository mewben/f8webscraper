package utils

const (
	E_MAX_ENCODED        = "Maximum activation limit reached. Please try again tomorrow."
	E_MIN_ENCASH         = "Minimum encashment is Php 100."
	E_MEMBER_404         = "Member not found."
	E_MEMBER_PASS_REQ    = "Password is required."
	E_MEMBER_SPONSOR_REQ = "Sponsor Id is required."
	E_SLOT_AACTIVE       = "Slot already active."
	E_SLOT_403           = "Not authorized to modify this slot."
	E_USER_INACTIVE      = "User is not active."
	E_USER_NOT_ALLOWED   = "This user is not allowed to enter."
	E_WRONG_CRED         = "Wrong credentials."
	E_SAVE_ERROR         = "Save error."
	E_SESSION_EXPIRED    = "Session expired."
	E_TESTING            = "Testing error."
	E_500                = "Server Error."
)

type AppError struct {
	Error string
}

// returns AppError
// to be encoded to JSON
func ErrMarshal(err string) *AppError {
	e := AppError{
		Error: err,
	}

	return &e
}
