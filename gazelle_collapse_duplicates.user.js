// ==UserScript==
// @name        gazelle collapse duplicates
// @include     /https?://www\.empornium\.(me|sx|is)/torrents\.php.*/
// @exclude     /https?://www\.empornium\.(me|sx|is)/torrents\.php\?id.*/
// @include     /https?://www\.empornium\.(me|sx|is)/user\.php.*/
// @include     /https?://femdomcult\.org/torrents\.php.*/
// @exclude     /https?://femdomcult\.org/torrents\.php\?id.*/
// @include     /https?://femdomcult\.org/user\.php.*/
// @include     /https?://www\.cheggit\.me/torrents\.php.*/
// @exclude     /https?://www\.cheggit\.me/torrents\.php\?id.*/
// @include     /https?://www\.cheggit\.me/user\.php.*/
// @include     /https?://pornbay\.org/torrents\.php.*/
// @exclude     /https?://pornbay\.org/torrents\.php\?id.*/
// @include     /https?://pornbay\.org/user\.php.*/
// @include     /https?://(www\.)?enthralled\.me/torrents\.php.*/
// @exclude     /https?://(www\.)?enthralled\.me/torrents\.php\?id.*/
// @include     /https?://(www\.)?enthralled\.me/user\.php.*/
// @version     27.0
// @updateURL   https://github.com/colligere/collapse_duplicates/raw/master/gazelle_collapse_duplicates.user.js
// @require     http://code.jquery.com/jquery-2.1.1.js
// @require     https://raw.githubusercontent.com/jashkenas/underscore/1.8.3/underscore.js
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

'use strict';

// About
// This userscript groups variations (different resolution, container, ...) of the same torrent together to unclutter the torrent list.
//
// The original version of this script was written by node998 but hasn't been maintained in a while. I have now forked the script on github to incorporate some recent fixes and additions.

// Changelog:
// * version 27.0
// - Added an option to collapse chronologically (you'll see the group in the newest post's location)
// * version 26.2
// - Added support for enthralled.me
// * version 26.1
// - Added PSVR variant
// * version 26.0
// - support for pornbay
// - new option to preserve original title
// * version 25.7
// - improved handling of x265
// * version 25.6
// - settings button now shows on the .is domain
// * version 25.5
// - modified regexes for VR (to support occulus go) and resolutions (to support non-standard resolutions)
// * version 25.4
// - added empornium.is domain
// * version 25.3
// - support all *K resolutions
// * version 25.2
// - workaround for violentmonkey bug https://github.com/violentmonkey/violentmonkey/issues/713
// * version 25.1
// - change to download URL
// * version 25
// - Updates for new emp icons
// * version 24.4
// - Added support for new bookmark icons
// * version 24.3
// - Some more compatibility fixes
// * version 24.2
// - Fixed compatibility with direct thumbnails script (at least in vertical layout)
// * version 24.1
// - Disabled the new config options for engines that don't support GM functions
// * version 24
// - Added a configuration dialog (accessible through the user menu on emp)
// - Added options to bring back the emp freeleech/warned/checked icons (off by default)
// - Added horizontal stacking of versions (off by default)
// - Requires 2 extra grants (GM.setValue and GM.getValue) to store settings
// * version 23
// - Improved handling of VR tags
// * version 22
// - Removed absolute positioning for freeleech & warning icons
// * version 21
// - Further GM4 & FF57+ fixes
//    - fixed: The script would get executed twice when using the browser back/forward buttons (fix by sapphreak)
// * version 20
// - Compatibility with greasemonkey 4.0
//   - Replaced GM_addStyle
//   - Removed jQuery.noConflict (fix by sapphreak)
// * version 19
// - improvement: collapse patterns are now category-specific
// * version 18.4
// - improvement: added ipad variation
// * version 18.3
// - improvement: included vive
// - improvement: added @updateURL metadata
// * version 18.2
// - improvement: included game platforms PC and MAC
// * version 18.1
// - fixed: PornBay compatibility (fix by Starbuck)
// * version 18
// - fixed: only one torrent is visible (fix by starbuck)
// - improvement: include variations mobile-high,mobile-medium and mobile-low
// - improvement: included video containers 3gp and mpeg4
// - change: this script is now forked on github
// * version 17
// - added option for freeleech icon
// - added option for warning icon
// * version 16
// - added resolutions 240, 380, 960, 1440, 1600, 1920
// - added image resolutions 1600px, 2000px, 3000px
// - added variations h.265, h265, hevc, uhd
// - added variations Oculus, Playstation
// - added variations "lower bitrate", "higher bitrate"
// - added resolution suffix *
// - added support for pornbay.org
// - added support for cheggit.me
// * version 15
// - added variation lq
// - added variations 30 fps, 60 fps
// - added variations Samsung, Smartphone
// * version 14
// - improved detection of VR variations
// - added resolution 416
// - added bitstream variations 1K, 2K
// * version 13
// - removed leading space on empty version title (without symbols)
// - added comments indicator (links directly to comments section)
// - simplified version title css selector
// - added variation Mps
// - added variation "Oculus Rift"
// - added variation "Virtual Reality"
// - added variations "Desktop VR", "Smartphone VR", "Gear VR", "Oculus VR"
// - added variations ultrahd, hi-res
// - added variations splitsceces, split-scenes, "split sceces"
// * version 12
// - added resolution 405
// - added support for notifications page
// * version 11
// - added freeleech icon ∞
// - added warning icon ⚑
// - added option to add tags from collapsed duplicates
// - added resolutions 272, 326, 392, 408, 450
// - moved mov and wmv to video_containers group
// - added variations fhd, mkv
// - added variations "images", "picture set"
// - extracted Group and Version from main code
// - fixed and improved sorting (720p > SD)
// - small changes to css
// * version 10
// - reworked and extracted matching algorithm to separate module with 3 specialized engines
// - added precise trimmers to remove remaining delimiters (space , - / +) while collapsing
// - added support for ** containers
// - added support for {} containers
// - added resolutions 352, 544, 558, 640, 1072
// - added variations hq, uhq, sd, hd
// - added variations "w images" and "with images"
// - normalization for multiple spaces
// - replace left delimiter with space
// - improved performance 125ms -> 87ms
// - less hacky solution for [MP4]s
// - versions and variations are now surrounded by parenthesis []
// - small adjustment to css
// - new dependency underscore.js
// * version 9
// - fix css for direct thumbnails (when replace_categories is off)
// - added support for femdomcult.org
// * version 8
// - symmetric variations (before or after resolution)
// - support for new variations: web-dl, mov, wmv
// - fixed version title being wrapped on user pages
// - more reliable delimiter
// * version 7
// - download icons for every resolutions
// - checked by staff symbol for versions (replaces icon)
// - bookmark symbol for versions (replaces icon)
// - support for bitrate variation eg. [5Mbps]
// - support for classic resolutions eg. [1920x1080]
// * version 6
// - small changes to patterns
// * version 5
// - small changes to patterns
// * version 4
// - added support for bookmarks
// - fixed duplicates with the same name
// - added default thumbnails on hover
// * version 3
// - added support for stream "[]s" variation
// - added support for "H.265/HEVC" variation that appears after resolution
// - greatly improved sorting for combined versions
// * version 2
// - now it works on user pages
// * version 1
// - initial version

var comment_icon = [
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAz',
    'klEQVQoU43QPysEABjH8YfJv8tg8wLEaJTBrhRlUYTFcK/gJpuSN6FkvE0mqywG+Rh1y0km',
    'V1d3SbjHcC7uurv0HZ7h95meEMNrn0XnXqWU7pRMdINDXz9jp6qFX7DbM7Z7MtkBD31BOrB',
    'mRYTmAHBsw5ulcDsAbCtJ12FVq89MQUVqhrCj0TPfmHUmpfsQplSkupp3VWWb5lxJqWU9hB',
    'Nl+8YVzFtWdOlTSg17nU+2G7XlwosPNXXp0Vg3+Nu0I89OB4MQRswMByH+Ab4BEZhLmRFDo',
    'vgAAAAASUVORK5CYII='
].join('');

var css = [
    '/* hide default icons */',
    '.torrent .cats_col + td > span, .torrent .cats_cols + td > span {',
    '    display: none;',
    '}',
    '/* exception to display .newtorrent flag */',
    '.torrent .cats_col + td > span.newtorrent, .torrent .cats_cols + td > span.newtorrent {',
    '    display: initial;',
    '    margin-right: 0;',
    '}',
    '.torrent.collapse-hidden {',
    '    display: none;',
    '}',
    '.torrent .icon {',
    '    float: none;',
    '    margin-left: 0;',
    '    margin-top: 0;',
    '    margin-right: 4px;',
    '    vertical-align: bottom;',
    '}',
    '.torrent a[href^="/torrents.php?action=download"] {',
    '    margin-left: 0;',
    '}',
    '.torrent a[href^="torrents.php?action=download"] {',
    '    vertical-align: bottom;',
    '}',
    '.torrent .version .collapsed-title {',
    '    display: inline-block;',
    '    padding-top: 3px;',
    '    vertical-align: top;',
    '}',
    '.collapsed-freeleech, .collapsed_warning, .collapsed_okay, .collapsed_bookmarked {',
    '    margin-left: 5px !important;',
    '    top: 2px;',
    '}',
    '.torrent .version {',
    '    white-space: nowrap;',
    '    position: relative;',
    '}',
    '.torrent .version:first-of-type {',
    '    padding-top: 3px;',
    '}',
    '.torrent .version_horizontal {',
    '    float: left;',
    '}',
    '.torrent .version .comment {',
    '    background-image: url("' + comment_icon + '");',
    '    background-repeat: no-repeat;',
    '    background-position: 0 -2px;',
    '    padding-left: 19px;',
    '    margin-left: 5px;',
    '    text-align: right;',
    '}',
    '.torrent .version .comment_vertical {',
    '    position: absolute;',
    '    right: 0;',
    '    background-position: 0 1px;',
    '}',
    '.torrent .horizontal_separator {',
    '    float: none;',
    '    margin-left: 11px;',
    '    margin-right: 10px;',
    '    vertical-align: super;',
    '    color: #004DC0;',
    '    font-weight: bold;',
    '}',
    '.torrent_icon_container {',
    '    display: none',
    '}',
    '.version .icon_stack {',
	'    width: 18px;',
	'    height: 22px;',
	'    animation-play-state: paused;',
    '}',
    '.version .icon_stack:hover {',
	'    animation-play-state: running;',
    '}',
    '.version img {',
    '    vertical-align: bottom;',
    '    margin-right: 3px;',
    '}',
].join('\n');

// Replacement for GM_addStyle, which isn't available on greasemonkey > v4.0
function add_css(styles, id) {
   var params = {'type': "text/css"};
   if (id) params.id = id;
   var element = jQuery("<style />", params).html(styles);
   jQuery('head').append(element);
}


// very fast difference
// can only work on sorted unique arrays
var difference_fast = function (a, b, compare_function) {
    var a_idx = 0;
    var b_idx = 0;
    var a_len = a.length;
    var b_len = b.length;
    var result = [];

    while (a_idx < a_len && b_idx < b_len) {
        switch (compare_function(a[a_idx], b[b_idx])) {
            case 0: // common
                a_idx++;
                b_idx++;
                break;
            case 1: // only in b
                b_idx++;
                break;
            case -1: // only in a
                result.push(a[a_idx]);
                a_idx++;
                break;
        }
    }
    if (a_idx < a_len && b_idx == b_len)
        return result.concat(a.slice(a.idx));
    return result;
};

// begin TitleParser

// like String.prototype.match(//g) but remembers matched groups
var match_and_remember = function (content, pattern) {
    var matches = [];
    var match;
    while ((match = pattern.exec(content))) {
        matches.push(match);
    }
    // reset last index, so pattern can be used again
    pattern.lastIndex = 0;
    return matches;
};

// slightly modified mutation of match_and_remember and collect_hits
// because it works without containers, it must trim next part after
// each match
var match_remember_and_collect = function (content, patterns, trimmers) {
    var hits = [];
    // for each pattern
    var reduced_content = patterns.reduce(function (content, pattern) {
        var match;
        // for each match
        while ((match = pattern.regexp.exec(content))) {
            // add it to hits
            hits.push({
                rank: pattern.rank,
                match: match[1] // store memorized match
            });
            // and remove it from content
            var content_before = content.slice(0, match.index);
            var content_after = content.slice(match.index + match[0].length);
            var trimmed_before = content_before.replace(trimmers.right, ' ');
            var trimmed_after = content_after.replace(trimmers.left, '');
            content = trimmed_before + trimmed_after;

            // reset last index, so pattern can be used again
            // match will always be removed from content
            // so infinite loop is not possible
            pattern.regexp.lastIndex = 0;
        }
        return content.replace(trimmers.both, '');
    }, content);
    return {
        reduced_content: reduced_content,
        hits: hits
    };
};

function MirrorEngine(patterns, trimmers) {
    var self = this;

    this.open_container = function (match) {
        return {
            source: match[0],
            before: match[1],
            open: match[2],
            content: match[3],
            close: match[4],
            after: match[5]
        };
    };

    this.close_container = function (container, content) {
        if (content === undefined)
            content = container.content;
        return container.before + container.open + content + container.close + container.after;
    };

    this.container_have_hits = function(container) {
        return !!container.hits.length;
    };

    this.find_containers = function (title, container_pattern) {
        var containers = match_and_remember(title, container_pattern).map(self.open_container);

        containers.forEach(function (container) {
            var collected_hits = match_remember_and_collect(container.content, patterns, trimmers);
            container.reduced_content = collected_hits.reduced_content;
            container.hits = collected_hits.hits;
            container.before = container.before.replace(trimmers.right, '');
            container.after = container.after.replace(trimmers.left, '');
        });
        return containers.filter(self.container_have_hits);
    };

    this.trim_title = function (title, containers) {
        // for each container
        return containers.reduce(function (title, container) {
            // get content
            var content = container.reduced_content;
            // trim it
            // content = content.replace(trimmers, '')  // is no longer needed, because was already trimmed in collect_hits
            // if not empty surround it with proper parenthesis
            if (content.length) {
                content = self.close_container(container, content);
            }
            // and exclude container from title
            return title.replace(container.source, content);
        }, title).trim();
    };

    // @deprecated
    this.join_hits = function (containers) {
        return containers.reduce(function (hits, container) {
            return hits.concat(container.hits);
        }, []);
    };

    this.parse = function (title, container_pattern) {
        title = title.trim();

        var containers = self.find_containers(title, container_pattern);
        title = self.trim_title(title, containers);

        return {
            title: title,
            containers: containers
        };
    };
}

function CuttingEngine(patterns, trimmers) {
    var self = this;

    this.open_container = function (content) {
        return {
            content: content,
            hits: []
        };
    };

    this.split_title = function (title, container_pattern) {
        var containers = title.split(container_pattern).map(self.open_container);

        containers.forEach(function (container, index, containers) {
            if (index === 0 || index === containers.length - 1) {
                return;
            }
            var collected_hits = match_remember_and_collect(container.content, patterns, trimmers);
            container.reduced_content = collected_hits.reduced_content;
            container.hits = collected_hits.hits;
        });
        return containers;
    };

    this.join_title = function (containers) {
        return containers.map(function (container) {
            return container.hits.length ? container.reduced_content : container.content;
        }).join('');
    };

    this.trim_title = function (containers) {
        containers.forEach(function (container, index, containers) {
            if (container.hits.length && !container.reduced_content.length) {
                // remove container_pattern from previous and next container
                containers[index - 1].content = '';
                containers[index + 1].content = '';
                if (containers.length > index + 2) {
                    // trim next container to prevent creation double delimiters in content
                    // after joining containers
                    containers[index + 2].content = containers[index + 2].content.replace(trimmers.left, '');
                }
            }
        });
    };

    // @deprecated
    this.join_hits = function (containers) {
        return containers.reduce(function (hits, container) {
            return hits.concat(container.hits);
        }, []);
    };

    this.parse = function (title, container_pattern) {
        title = title.trim();

        var containers = self.split_title(title, container_pattern);
        self.trim_title(containers);
        title = self.join_title(containers);
        title = title.trim();

        return {
            title: title,
            containers: containers.filter(function (container) {return container.hits.length;})
        };
    };
}

function RawEngine(patterns, trimmers) {
    var self = this;

    this.container_from_hit = function (hit) {
        return {
            hits: [hit]
        };
    };

    this.parse = function (title) {
        var result = match_remember_and_collect(title, patterns, trimmers);
        return {
            title: result.reduced_content,
            containers: result.hits.map(self.container_from_hit)
        };
    };
}

function TitleParser() {
    var self = this;

    this.trimmers = {
        left: /^[-+,/ ]+/g,
        both: /^[-+,/ ]+|[-+,/ ]+$/g,
        right:          /[-+,/ ]+$/g
    };
    this.video_containers       = {rank:  0, regexp: /\b(mp4|mkv|wmv|mov|avi|3pg|3gp|mpeg4)\b/ig};
    this.resolutions            = {rank:  1, regexp: /\b([0-9]+p(?!x))\b/ig};
    this.resolutions_images     = {rank:  2, regexp: /\b((?:1600|2000|3000)px)\b/ig};
    this.resolutions_classic    = {rank:  3, regexp: /\b(\d+x\d+(?:p|i)?)\b/ig};
    this.resolutions_additional = {rank:  4, regexp: /\b([0-9]+k)\b/ig};
    this.variations             = {rank:  5, regexp: /\b(web-?dl|h\.26[45]\/hevc|hevc\/h\.265|h\.?26[45]|hevc|x\.?26[45]|split[- ]?scenes)\b/ig};
    this.variations_common      = {rank:  6, regexp: /\b(lq|sd|hd|ultrahd|fhd|uhd|hq|uhq|hi-res|mobile-high|mobile-medium|mobile-low|ipad)\b/ig};
    this.fps                    = {rank:  7, regexp: /\b((?:30|60) ?fps)\b/ig};
    this.bitrate                = {rank:  8, regexp: /\b(\d+(?:\.\d+)?[Mk]b?ps)\b/ig};
    this.bitrate_additional     = {rank:  9, regexp: /\b(bts)\b/ig};
    this.bitrate_additional2    = {rank:  9, regexp: /\b(1k|2k)\b/ig};
    this.bitrate_additional3    = {rank: 10, regexp: /\b((?:lower|higher) bitrate)\b/ig};
    this.picsets                = {rank: 11, regexp: /\b(w images|with images|images|picture set|picsets?|imagesets?)\b/ig};
    this.request                = {rank: 12, regexp: /\b(req|request)\b/ig};
    this.virtual_gear           = {rank: 13, regexp: /\b(Oculus,? Go|Oculus|Oculus\/vive|Oculus\/Rift|PSVR)\b/ig};
    this.virtual_gear2          = {rank: 13, regexp: /\b(Samsung|Smartphone|DayDream)\b/ig};
    this.virtual_gear3          = {rank: 14, regexp: /\b((?:Desktop|Smartphone|Gear|Playstation) ?VR|Oculus|vive)\b/ig};
    this.virtual_reality        = {rank: 15, regexp: /\b(Virtual ?Reality)\b/ig};
    this.games                  = {rank: 16, regexp: /\b(pc|mac)\b/ig};

    this.patterns_video = [
        this.video_containers,
        this.resolutions_classic,
        this.resolutions,
        this.resolutions_images,
        this.resolutions_additional,
        this.variations,
        this.variations_common,
        this.fps,
        this.bitrate,
        this.bitrate_additional,
        this.bitrate_additional2,
        this.bitrate_additional3,
        this.picsets,
        this.request,
        this.virtual_gear,
        this.virtual_gear2,
        this.virtual_gear3,
        this.virtual_reality
    ];

    this.patterns_games = [
        this.games
    ];

    this.patterns_for_raw = _.without(this.patterns_video, this.virtual_reality);

    this.pack_mirror = {
        engine: MirrorEngine,
        container_patterns: [
            /()(\[)([^\]]+?)(\])(s)$/g,
            /()(\[)(.+?)(\])([-, ]*)/g,
            /()(\()(.+?)(\))([-, ]*)/g,
            /()(\{)(.+?)(\})([-, ]*)/g
        ],
        patterns: {
            video: self.patterns_video,
            games: self.patterns_games
        },
        trimmers: self.trimmers
    };

    this.pack_cutting = {
        engine: CuttingEngine,
        container_patterns: [
            /(\*)/
        ],
        patterns: {
            video: self.patterns_video,
            games: self.patterns_games
        },
        trimmers: self.trimmers
    };

    this.pack_raw = {
        engine: RawEngine,
        container_patterns: [null],
        patterns: {
            video: self.patterns_for_raw,
            games: self.patterns_for_raw
        },
        trimmers: self.trimmers
    };

    this.is_not_empty = function (container) {
        return container.hits.length;
    };

    this.parse_pack = function (title, pack, category) {
        var match_patterns;

        if (category == 'games.apps') {
            match_patterns = pack.patterns.games;
        } else {
            match_patterns = pack.patterns.video;
        }

        var engine = new pack.engine(match_patterns, pack.trimmers);
        var containers = pack.container_patterns.map(function (container_pattern) {
            var result = engine.parse(title, container_pattern);
            title = result.title;
            return result.containers;
        });
        containers = _.flatten(containers, true);
        containers = containers.filter(self.is_not_empty);

        return {
            title: title,
            containers: containers
        };
    };

    this.compare = function(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    };

    this.compare_hits = function (a, b) {
        return self.compare(a.rank, b.rank);
    };

    this.add_rank_boundaries = function (container) {
        var ranks = _.pluck(container.hits, 'rank');
        container.rank_min = Math.min.apply(null, ranks);
    };

    this.parse = function (title, category) {
        title = title.trim();

        var mirror_result = self.parse_pack(title, self.pack_mirror, category);
        title = mirror_result.title;

        var cutting_result = self.parse_pack(title, self.pack_cutting, category);
        title = cutting_result.title;

        var raw_result = self.parse_pack(title, self.pack_raw, category);
        title = raw_result.title;

        var containers = _.flatten([
            mirror_result.containers,
            cutting_result.containers,
            raw_result.containers
        ], true);

        return {
            title: title,
            containers: containers
        };
    };

    this.simplify = function (result) {
        var hits = _.flatten(_.pluck(result.containers, 'hits'), true);
        var plain_hits = _.pluck(hits.sort(self.compare_hits), 'match');

        return {
            title: result.title,
            hits: plain_hits
        };
    };
}

// end TitleParser

function Version(title_parser, $row, config) {
    var self = this;

    this.symbol_check = '✓';
    this.symbol_warning = '⚑';
    this.symbol_bookmark = '★';
    this.symbol_freeleech = '∞';
    this.$title = null;
    this.reduced_title = null;

    this.freeleech = false

    this._get_$checkbox = function () {
        return $row.find('input[type=checkbox]');
    };

    this._get_$title = function () {
        return $row.find('a[href^="torrents.php?id"], a[href^="/torrents.php?id"]');
    };

    this._get_$comments = function () {
        return $row.find([
            '.cats_col  + td + td + td',
            '.cats_cols + td + td + td'
        ].join(', '));
    };

    this._get_$tags_container = function () {
        return $row.find('.tags');
    };

    this._get_$tags = function () {
        return $row.find('.tags a');
    };

    this._get_$check_icon = function () {
        if ($row.find('.torrent_icon_container .icon_torrent_okay').length > 0) {
            return $row.find('.torrent_icon_container .icon_torrent_okay').parents('span');
        } else if ($row.find('.icon_okay').length > 0) {
            return $row.find('.icon_okay');
        } else {
            return 0;
        }
    };

    this._get_$warning_icon = function () {
        if ($row.find('.torrent_icon_container .icon_torrent_warned').length > 0) {
            return $row.find('.torrent_icon_container .icon_torrent_warned').parents('span');
        } else if ($row.find('.icon_warning').length > 0) {
            return $row.find('.icon_warning');
        } else {
            return 0;
        }
    };

    this._get_$bookmark_icon = function () {
        if ($row.find('.torrent_icon_container .icon_nav_bookmarks').length > 0) {
            return $row.find('.torrent_icon_container .icon_nav_bookmarks').parents('span');
        } else if ($row.find('img[alt^=bookmarked]').length > 0) {
            return $row.find('img[alt^=bookmarked]');
        } else {
            return 0;
        }
    };

    this._get_$bookmarked = function () {
        return $row.find('.torrent_icon_container .bookmarked').parents('span');
    };

    this._get_$freeleech_icon = function () {
        var fl = $row.find('.torrent_icon_container .icon_torrent_bonus').parents('span');

        if (fl.length > 0) { // emp style
            if (fl.find('.unlimited_leech').length) {
                self.freeleech = true;
            }
            return fl;
        } else { // vanilla Gazelle style
            if ($row.find('img[alt^=Freeleech]').length > 0) {
                self.freeleech = true;
                return $row.find('img[alt^=Freeleech]');
            }
        }

        return 0;
    };

    this._get_$download_icon = function () {
        if ($row.find('a[href^="/torrents.php?action=download"]').length > 0) { // emp style
            return $row.find('a[href^="/torrents.php?action=download"]').parent();
        } else if ($row.find('a[href^="torrents.php?action=download"]').length > 0) { // vanilla Gazelle style
            return $row.find('a[href^="torrents.php?action=download"]');
        } else {
            return 0;
        }
    };

    this._get_$category = function () {
        return $row.find('.cats_col > div')
    }

    this._get_$timestamp = function () {
        return Date.parse($row.find('.time').attr('alt'))
    }

    this.apply_mp4s_workaround = function (containers) {
        var mp4s = _.findWhere(containers, {after: 's'});
        if (mp4s === undefined)
            return;
        var res = _.findWhere(containers, {rank_min: title_parser.resolutions.rank});
        if (res === undefined)
            return;
        res.after = mp4s.after;
        mp4s.after = '';
    };

    this._get_name = function () {
        if (!self.containers.length)
            return '';
        var containers = _.sortBy(self.containers, 'rank_min');
        return _.pluck(containers, 'tag').join(' ');
    };

    this._init = function () {
        self.$checkbox = self._get_$checkbox();
        self.$title = self._get_$title();
        self.$comments = self._get_$comments();
        self.$tags = self._get_$tags();
        self.$tags_container = self._get_$tags_container();
        self.$check_icon = self._get_$check_icon();
        self.$warning_icon = self._get_$warning_icon();
        self.$bookmark_icon = self._get_$bookmark_icon();
        self.$bookmarked = self._get_$bookmarked();
        self.$freeleech_icon = self._get_$freeleech_icon();
        self.$download_icon = self._get_$download_icon();
        self.$category = self._get_$category();
        self.$timestamp = self._get_$timestamp();

        var title = self.$title.text();
        var category = self.$category.attr('title');
        var result = title_parser.parse(title, category);

        self.reduced_title = result.title.replace(/\s+/g, ' ');
      //  self.minimal_title = result.title.replace(/[^a-zA-Z0-9]/g, '');

        self.containers = result.containers;

        self.containers.forEach(title_parser.add_rank_boundaries);
        self.apply_mp4s_workaround(self.containers);
        self.containers.forEach(self._add_tag);
        self.name = self._get_name();
    };

    this.toggle_checkbox = function (value) {
        self.$checkbox.prop('checked', value);
    };

    this._add_tag = function (container) {
        var hits = _.sortBy(container.hits, 'rank');
        var content = _.pluck(hits, 'match').join(', ');
        container.tag = '[' + content + ']' + (container.after || '');
    };

    this._version_title = function () {
        var new_title = [];
        var new_icons = [];
        if (self.name)
            new_title.push(self.name);

        if (self.$check_icon.length && !config.icon_checked) {
            new_title.push(self.symbol_check);
        }
        if (self.$warning_icon.length && !config.icon_warning) {
            new_title.push(self.symbol_warning);
        }
        if (self.$bookmarked.length && !config.icon_bookmarked) {
            new_title.push(self.symbol_bookmark);
        }
        if (self.freeleech === true && !config.icon_freeleech) {
            new_title.push(self.symbol_freeleech);
        }

        var $new_title = self.$title.clone();
        $new_title.addClass('collapsed-title');
        $new_title.text(new_title.join('\u00a0') || '\u00a0');
        new_icons.forEach(function (icon) {
            $new_title.append(icon);
        });

        return $new_title;
    };

    this._comments_link = function () {
        var link = jQuery('<a class="comment"></a>');
        link.text(self.$comments.text().trim());
        link.attr('href', self.$title.attr('href') + '#thanksdiv');

        if (config.show_vertical) {
            link.addClass('comment_vertical');
        }

        return link;
    };

    this.collapse = function () {
        self.collapse = null;

        var $el = jQuery('<div class="version"></div>');

        if (self.$download_icon.length) {
            $el.append(self.$download_icon);
        }
        if (self.$freeleech_icon.length && config.icon_freeleech) {
            $el.append(self.$freeleech_icon);
        }
        if (self.$check_icon.length && config.icon_checked) {
            $el.append(self.$check_icon);
        }
        if (self.$warning_icon.length && config.icon_warning) {
            $el.append(self.$warning_icon);
        }
        if (self.$bookmark_icon.length && config.icon_bookmarked) {
            $el.append(self.$bookmark_icon);
        }

        $el.append(self._version_title());


        if (!self.$checkbox.length && parseInt(self.$comments.text()) > 0) {
            $el.append(self._comments_link());
        }

        // support for vertical and horizontal stacking of versions
        if (!config.show_vertical) {
            $el.addClass('version_horizontal');
        }

        return $el;
    };

    this.hide = function () {
        $row.addClass('collapse-hidden');
    };

    this._init();
}

function Group(name) {
    var self = this;

    this.versions = [];

    this.add_version = function (version) {
        self.versions.push(version);
    };

    this.compare = function(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    };

    this.compare_mixed = function (a_str, b_str) {
        var a_num = a_str.match(/\d+/g) || [];
        var b_num = b_str.match(/\d+/g) || [];

        if (a_num.length && b_num.length) {
            // number compare each pair of pattern matches
            var length = Math.min(a_num.length, b_num.length);
            for (var i = 0; i < length; i++) {
                var a_int = parseInt(a_num[i]);
                var b_int = parseInt(b_num[i]);

                if (isNaN(a_int) || isNaN(b_int))
                    break;

                var result = self.compare(a_int, b_int);
                if (result !== 0)
                    return result;
            }
            return self.compare(a_str, b_str);
        }
        else if(a_num.length || b_num.length)
            return a_num.length ? 1 : -1;
        else
            return self.compare(a_str, b_str);
    };

    this.compare_versions = function (a, b) {
        var a_str = a.name;
        var b_str = b.name;
        return self.compare_mixed(a_str, b_str);
    };

    this.compare_tags = function (a, b) {
        return self.compare(a.name, b.name);
    };

    this._convert_tag = function () {
        var $this = jQuery(this);
        return {
            name: $this.text(),
            elem: this
        };
    };

    this._convert_tags = function (tags) {
        return tags.map(self._convert_tag).get();
    };

    this._missing_tags = function (versions) {
        var visible_tags = self._convert_tags(versions[0].$tags);
        var hidden_tags = _.pluck(versions.slice(1), '$tags');
        hidden_tags = hidden_tags.map(self._convert_tags);
        hidden_tags = _.flatten(hidden_tags, true);

        visible_tags.sort(self.compare_tags);
        hidden_tags.sort(self.compare_tags);
        hidden_tags = _.uniq(hidden_tags, true, function (tag) {return tag.name;});

        return difference_fast(hidden_tags, visible_tags, self.compare_tags);
    };

    this.collapse = function (config) {
        self.collapse = null;
        var versions = {};

        if ( ! config.sort_chronological) {
            versions = self.versions.sort(self.compare_versions).reverse();
        } else {
            versions = self.versions
        }

        _.invoke(versions.slice(1), 'hide');

        var collapsed_versions = _.invoke(versions, 'collapse');
        versions[0].$title.after(collapsed_versions);
        if ( ! config.preserve_title) {
            versions[0].$title.text(name);
        }
        versions[0].$title.parent().find('br').remove();

        if (!config.show_vertical) {
          versions[0].$title.after('<div style="clear: both; margin-bottom: 3px;"></div>');
        }

        versions[0].$checkbox.change(function(event) {
            var checked = event.currentTarget.checked;
            _.invoke(versions.slice(1), 'toggle_checkbox', checked);
        });

        if (!config.show_vertical) {
            jQuery.each(collapsed_versions, function(i, version) {
                if (i > 0) {
                    collapsed_versions[i].prepend('<span class="horizontal_separator"> | </span>');
                }
            });
        }

        if (versions.length && config.add_missing_tags) {
            var missing_tags = self._missing_tags(versions);
            if (missing_tags.length) {
                var elements = _.pluck(missing_tags, 'elem');
                elements.forEach(function (elem) {
                    versions[0].$tags_container.append(' ', jQuery(elem).clone());
                });
            }
        }
    };
}

function CollapseDuplicates(title_parser, config) {
    var self = this;

    this.groups = {};

    this.get_group = function (name) {
        var group = self.groups[name];
        if (group === undefined) {
            group = new Group(name);
            self.groups[name] = group;
        }
        return group;
    };

    this.create_group = function (_, row) {
        var version = new Version(title_parser, jQuery(row), config);
        self.get_group(version.reduced_title).add_version(version);
    };

    this.create_groups = function() {
        jQuery('.torrent_table').find('tr.torrent').each(self.create_group);
    };

    this.collapse_group = function (group) {
        group.collapse(config);
    };

    this.collapse_groups = function() {
        _.each(self.groups, self.collapse_group);
    };

    this.create_groups();
    this.collapse_groups();
}

function CreateConfigDialog(config) {
    var css = [
        '.cdc_checkbox {',
        '   margin-right: 4px',
        '}'
    ].join('\n');

    // add general css
    add_css(css, 'collapse_duplicates_config');

    jQuery("body").prepend(
        // config dialog background
        jQuery('<div>', {id: 'cdc_background'})
            .css({position:'fixed', top:0, bottom:0, left:0, right:0, 'z-index':1000, 'background-color':'rgba(50,50,50,0.6)'})
            .html(
                // config container
                jQuery('<div>', {id: 'cdc_container'})
                    .css({background:'#eee', color:'#444', position:'relative', width:'1000px', overflow:'hidden', margin:'50px auto', 'font-size':'14px', padding:'15px 20px', 'border-radius':'16px', 'box-shadow':'0 0 20px black'})
                    .html(jQuery('<h1>').text('Collapse duplicates settings'))

                    // the form
                    .append(
                        jQuery('<div>', {id: 'cdc_form_wrapper'})
                            .css({width:'100%', overflow:'hidden', border:'1px solid #444', 'border-radius':'4px', 'border-top-left-radius': '0px', 'box-shadow':'0 -1px 10px rgba(0,0,0,0.6)'})
                            .html(
                                jQuery('<form>', {id: 'cdc_form'})
                                    .css({display:'block', background:'#fff', padding:'15px'})
                            )
                    )
            )
    )

    // add actual form content
    jQuery('#cdc_form').html(
        jQuery('<h2>')
            .text('Icons')
            .css({background: 'none', 'text-align': 'left', 'color': '#444', 'padding': 0, 'padding-left': '7px'})
    )

    // freeleech icon
    jQuery('#cdc_form').append(
        jQuery('<label>')
            .css({display: 'block'})
            .text('Use native freeleech icon')
            .prepend(
                jQuery('<input>', {
                    type: 'checkbox',
                    id: 'cdc_config_opt_icon_freeleech',
                    name: 'icon_freeleech',
                    class: 'cdc_checkbox',
                    checked: config.config.icon_freeleech,
                })
            )
    )

    // warned icon
    jQuery('#cdc_form').append(
        jQuery('<label>')
            .css({display: 'block'})
            .text('Use native warned icon')
            .prepend(
                jQuery('<input>', {
                    type: 'checkbox',
                    id: 'cdc_config_opt_icon_warning',
                    name: 'icon_warning',
                    class: 'cdc_checkbox',
                    checked: config.config.icon_warning,
                })
            )
    )

    // checked icon
    jQuery('#cdc_form').append(
        jQuery('<label>')
            .css({display: 'block'})
            .text('Use native checked icon')
            .prepend(
                jQuery('<input>', {
                    type: 'checkbox',
                    id: 'cdc_config_opt_icon_checked',
                    name: 'icon_checked',
                    class: 'cdc_checkbox',
                    checked: config.config.icon_checked,
                })
            )
    )

    // bookmarked icon
    jQuery('#cdc_form').append(
        jQuery('<label>')
            .css({display: 'block'})
            .text('Use native bookmarked icon')
            .prepend(
                jQuery('<input>', {
                    type: 'checkbox',
                    id: 'cdc_config_opt_icon_bookmarked',
                    name: 'icon_bookmarked',
                    class: 'cdc_checkbox',
                    checked: config.config.icon_bookmarked,
                })
            )
    )

    // torrent list
    jQuery('#cdc_form').append(
        jQuery('<h2>')
            .text('Collapse settings')
            .css({background: 'none', 'text-align': 'left', 'color': '#444', 'padding': 0, 'padding-left': '7px'})
    )

    // horizontal or vertical
    jQuery('#cdc_form').append(
        jQuery('<label>')
            .css({display: 'block'})
            .text('Collapse versions vertically')
            .prepend(
                jQuery('<input>', {
                    type: 'checkbox',
                    id: 'cdc_config_opt_show_vertical',
                    name: 'show_vertical',
                    class: 'cdc_checkbox',
                    checked: config.config.show_vertical,
                })
            )
    )

    // preserve titles
    jQuery('#cdc_form').append(
        jQuery('<label>')
            .css({display: 'block'})
            .text('Preserve titles')
            .prepend(
                jQuery('<input>', {
                    type: 'checkbox',
                    id: 'cdc_config_opt_preserve_titles',
                    name: 'preserve_title',
                    class: 'cdc_checkbox',
                    checked: config.config.preserve_title,
                })
            )
    )

    // sort chronological
    jQuery('#cdc_form').append(
        jQuery('<label>')
            .css({display: 'block'})
            .text('Sort chronological (instead of alphabetical)')
            .prepend(
                jQuery('<input>', {
                    type: 'checkbox',
                    id: 'cdc_config_opt_sort_chronological',
                    name: 'sort_chronological',
                    class: 'cdc_checkbox',
                    checked: config.config.sort_chronological,
                })
            )
    )

    // add the close button
    jQuery('#cdc_container').append(
        jQuery('<div>', {id: 'cdc_bottom_buttons'})
            .css({'margin-top': '15px', width:'100%', 'text-align':'center'})
            .html(
                jQuery('<input>', {
                    type: 'button',
                    name: 'cdc_config_btn_close',
                    value: 'Close'
                }).on("click", function(e){
                    e.preventDefault();
                    jQuery('#cdc_background').remove();
                })
            )
    )

    // Add the save button
    jQuery('#cdc_bottom_buttons').append(
        jQuery('<input>', {
            type: 'button',
            name: 'cdc_config_btn_save',
            value: 'Save'
        }).on("click", function(e){
            e.preventDefault();
            var reload = false;

            jQuery('.cdc_checkbox').each(function(i, box) {
                if (config.config[box.name] != box.checked) {
                    config.config[box.name] = box.checked;
                    reload = true;
                }
            })

            config.save();

            if (reload == true) {
                location.reload();
            } else {
                jQuery('#cdc_background').remove();
            }

        })
    )

}

function CollapseConfig() {
    var self = this;

    this.config = {
        icon_freeleech: false,
        icon_warning: false,
        icon_checked: false,
        icon_bookmarked: false,
        show_vertical: true,
        add_missing_tags: false,
        preserve_title: false,
        sort_chronological: false
    };

    this.save = function() {
        GM.setValue('collapse_duplicates_config', this.config);
    }

    this.get_config = (async function() {
        var cfg

        if (typeof GM != 'undefined') {
          cfg = await GM.getValue('collapse_duplicates_config');
        }

        if (typeof cfg !== 'undefined') {
            self.config = cfg;
        }
    })
}

(async function () {
    if(!document.getElementById('collapse_duplicates')){
       var config = new CollapseConfig();
       await config.get_config();

       if (!config.config.show_vertical) {
            css += [
            '.torrent .tags {',
            '    padding-top: 3px;',
            '    clear: both;',
            '}'
            ].join('\n');
        } else {
            css += [
                '.torrent .tags {',
                '    padding-top: 3px;',
                '}'
            ].join('\n');
        }

        add_css(css, 'collapse_duplicates');

       new CollapseDuplicates(new TitleParser, config.config);

       if (typeof GM != 'undefined') {
            if (window.location.href.match(new RegExp('https?://www\.empornium\.(me|sx|is)')) || window.location.href.match(new RegExp('https?://(www\.)?enthralled\.(me)'))) { // emp/ent config
                    jQuery('#nav_userinfo ul').append(
                        jQuery('<li>', {
                            id:     'cdc_open_config',
                            html:   (
                                jQuery('<a>')
                                    .attr('href', '#')
                                    .attr('title', 'Collapse duplicates settings')
                                    .text('Collapse duplicates')
                                    .click(function(e) {
                                        e.preventDefault();
                                        CreateConfigDialog(config);
                                    })
                            )
                        })
                    )
            } else if (window.location.href.match(new RegExp('https?://(www\.)?pornbay\.(org)'))) { // pornbay config
                jQuery('#nav_inbox').parent().append(
                    jQuery('<li>', {
                        id:     'cdc_open_config',
                        html:   (
                            jQuery('<a>')
                                .attr('href', '#')
                                .attr('title', 'Collapse duplicates settings')
                                .text('Collapse duplicates')
                                .click(function(e) {
                                    e.preventDefault();
                                    CreateConfigDialog(config);
                                })
                        )
                    }).addClass('normal potato-menu-item')
                )
            }
        }
   }
})();
