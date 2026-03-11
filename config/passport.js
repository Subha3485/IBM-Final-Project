const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

function upsertOAuthUser({ provider, providerId, displayName, email, avatar }) {
    if (!email) {
        throw new Error(`${provider} did not return an email address.`);
    }

    const update = {
        name: displayName || email.split("@")[0],
        email,
        avatar: avatar || "",
        authProvider: provider,
    };

    if (provider === "google") update.googleId = providerId;
    if (provider === "facebook") update.facebookId = providerId;

    return User.findOneAndUpdate(
        { email },
        { $set: update, $setOnInsert: { password: "" } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
}

function configurePassport() {
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const primaryEmail = profile.emails?.[0]?.value || "";
                    const avatar = profile.photos?.[0]?.value || "";
                    const user = await upsertOAuthUser({
                        provider: "google",
                        providerId: profile.id,
                        displayName: profile.displayName,
                        email: primaryEmail,
                        avatar,
                    });
                    done(null, user);
                } catch (error) {
                    done(error);
                }
            }
        ));
    }

    if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
        passport.use(new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL || "/auth/facebook/callback",
                profileFields: ["id", "displayName", "photos", "email"],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const primaryEmail = profile.emails?.[0]?.value || "";
                    const avatar = profile.photos?.[0]?.value || "";
                    const user = await upsertOAuthUser({
                        provider: "facebook",
                        providerId: profile.id,
                        displayName: profile.displayName,
                        email: primaryEmail,
                        avatar,
                    });
                    done(null, user);
                } catch (error) {
                    done(error);
                }
            }
        ));
    }
}

module.exports = { passport, configurePassport };
