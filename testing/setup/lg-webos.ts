// LG webOS: Chromium-based web runtime. webOS 5 ships Chrome 68, which is
// also the webpack build target.
import { setUserAgent } from './web';
import { USER_AGENTS } from '../helpers/remote';

setUserAgent(USER_AGENTS['lg-webos']);
