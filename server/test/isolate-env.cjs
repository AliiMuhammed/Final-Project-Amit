// Unit tests must never read the owner's live service credentials.
require("dotenv").config = () => ({ parsed: {} });
