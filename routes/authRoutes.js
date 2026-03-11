const express = require("express");
const jwt = require("jsonwebtoken");
const { passport } = require("../config/passport");

const router = express.Router();

function createToken(user) {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
}

function handleOAuthSuccess(req, res) {
    const token = createToken(req.user);
    return res.redirect(`/login?token=${encodeURIComponent(token)}&provider=${encodeURIComponent(req.user.authProvider || "oauth")}`);
}

function handleOAuthFailure(res, provider, reason = "not_configured") {
    return res.redirect(`/login?oauthError=${encodeURIComponent(`${provider}:${reason}`)}`);
}

router.get("/google", (req, res, next) => {
    if (!passport._strategies.google) {
        return handleOAuthFailure(res, "google");
    }
    return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
    if (!passport._strategies.google) {
        return handleOAuthFailure(res, "google");
    }
    return passport.authenticate("google", { failureRedirect: "/login?oauthError=google:failed" })(req, res, next);
}, handleOAuthSuccess);

router.get("/facebook", (req, res, next) => {
    if (!passport._strategies.facebook) {
        return handleOAuthFailure(res, "facebook");
    }
    return passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
});

router.get("/facebook/callback", (req, res, next) => {
    if (!passport._strategies.facebook) {
        return handleOAuthFailure(res, "facebook");
    }
    return passport.authenticate("facebook", { failureRedirect: "/login?oauthError=facebook:failed" })(req, res, next);
}, handleOAuthSuccess);

module.exports = router;
