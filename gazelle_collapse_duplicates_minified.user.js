﻿// ==UserScript==
// @name        gazelle collapse duplicates
// @include     /https?://www\.empornium\.(me|sx)/torrents\.php.*/
// @exclude     /https?://www\.empornium\.(me|sx)/torrents\.php\?id.*/
// @include     /https?://www\.empornium\.(me|sx)/user\.php.*/
// @include     /https?://femdomcult\.org/torrents\.php.*/
// @exclude     /https?://femdomcult\.org/torrents\.php\?id.*/
// @include     /https?://femdomcult\.org/user\.php.*/
// @include     /https?://www\.cheggit\.me/torrents\.php.*/
// @exclude     /https?://www\.cheggit\.me/torrents\.php\?id.*/
// @include     /https?://www\.cheggit\.me/user\.php.*/
// @include     /https?://pornbay\.org/torrents\.php.*/
// @exclude     /https?://pornbay\.org/torrents\.php\?id.*/
// @include     /https?://pornbay\.org/user\.php.*/
// @version     20.0
// @updateURL   https://github.com/colligere/collapse_duplicates/raw/master/gazelle_collapse_duplicates_minified.user.js
// @require     http://code.jquery.com/jquery-2.1.1.js
// @require     https://raw.githubusercontent.com/jashkenas/underscore/1.8.3/underscore.js
// ==/UserScript==
"use strict";function MirrorEngine(t,e){var n=this;this.open_container=function(t){return{source:t[0],before:t[1],open:t[2],content:t[3],close:t[4],after:t[5]}},this.close_container=function(t,e){return void 0===e&&(e=t.content),t.before+t.open+e+t.close+t.after},this.container_have_hits=function(t){return!!t.hits.length},this.find_containers=function(i,r){var a=match_and_remember(i,r).map(n.open_container);return a.forEach(function(n){var i=match_remember_and_collect(n.content,t,e);n.reduced_content=i.reduced_content,n.hits=i.hits,n.before=n.before.replace(e.right,""),n.after=n.after.replace(e.left,"")}),a.filter(n.container_have_hits)},this.trim_title=function(t,e){return e.reduce(function(t,e){var i=e.reduced_content;return i.length&&(i=n.close_container(e,i)),t.replace(e.source,i)},t).trim()},this.join_hits=function(t){return t.reduce(function(t,e){return t.concat(e.hits)},[])},this.parse=function(t,e){t=t.trim();var i=n.find_containers(t,e);return t=n.trim_title(t,i),{title:t,containers:i}}}function CuttingEngine(t,e){var n=this;this.open_container=function(t){return{content:t,hits:[]}},this.split_title=function(i,r){var a=i.split(r).map(n.open_container);return a.forEach(function(n,i,r){if(0!==i&&i!==r.length-1){var a=match_remember_and_collect(n.content,t,e);n.reduced_content=a.reduced_content,n.hits=a.hits}}),a},this.join_title=function(t){return t.map(function(t){return t.hits.length?t.reduced_content:t.content}).join("")},this.trim_title=function(t){t.forEach(function(t,n,i){t.hits.length&&!t.reduced_content.length&&(i[n-1].content="",i[n+1].content="",i.length>n+2&&(i[n+2].content=i[n+2].content.replace(e.left,"")))})},this.join_hits=function(t){return t.reduce(function(t,e){return t.concat(e.hits)},[])},this.parse=function(t,e){t=t.trim();var i=n.split_title(t,e);return n.trim_title(i),t=n.join_title(i),t=t.trim(),{title:t,containers:i.filter(function(t){return t.hits.length})}}}function RawEngine(t,e){var n=this;this.container_from_hit=function(t){return{hits:[t]}},this.parse=function(i){var r=match_remember_and_collect(i,t,e);return{title:r.reduced_content,containers:r.hits.map(n.container_from_hit)}}}function TitleParser(){var t=this;this.trimmers={left:/^[-+,/ ]+/g,both:/^[-+,/ ]+|[-+,/ ]+$/g,right:/[-+,/ ]+$/g},this.video_containers={rank:0,regexp:/\b(mp4|mkv|wmv|mov|avi|3pg|3gp|mpeg4)\b/gi},this.resolutions={rank:1,regexp:/\b((?:240|270|272|326|352|360|368|380|384|392|396|400|404|405|406|408|416|420|432|450|480|540|544|558|576|640|674|720|960|1072|1080|1440|1600|1920|2160)(?:p|i)?)\b\*?/gi},this.resolutions_images={rank:2,regexp:/\b((?:1600|2000|3000)px)\b/gi},this.resolutions_classic={rank:3,regexp:/\b(\d+x\d+(?:p|i)?)\b/gi},this.resolutions_additional={rank:4,regexp:/\b(4k)\b/gi},this.variations={rank:5,regexp:/\b(web-?dl|h\.265\/hevc|hevc\/h\.265|h\.?265|hevc|split[- ]?scenes)\b/gi},this.variations_common={rank:6,regexp:/\b(lq|sd|hd|ultrahd|fhd|uhd|hq|uhq|hi-res|mobile-high|mobile-medium|mobile-low|ipad)\b/gi},this.fps={rank:7,regexp:/\b((?:30|60) ?fps)\b/gi},this.bitrate={rank:8,regexp:/\b(\d+(?:\.\d+)?Mb?ps)\b/gi},this.bitrate_additional={rank:9,regexp:/\b(bts)\b/gi},this.bitrate_additional2={rank:9,regexp:/\b(1k|2k)\b/gi},this.bitrate_additional3={rank:10,regexp:/\b((?:lower|higher) bitrate)\b/gi},this.picsets={rank:11,regexp:/\b(w images|with images|images|picture set|picsets?|imagesets?)\b/gi},this.request={rank:12,regexp:/\b(req|request)\b/gi},this.virtual_gear={rank:13,regexp:/\b((?:Desktop|Smartphone|Gear|Oculus|Playstation) ?VR|Oculus ?Rift|vive)\b/gi},this.virtual_gear2={rank:13,regexp:/\b(Samsung|Smartphone|Oculus)\b/gi},this.virtual_reality={rank:14,regexp:/\b(Virtual ?Reality)\b/gi},this.games={rank:15,regexp:/\b(pc|mac)\b/gi},this.patterns_video=[this.video_containers,this.resolutions_classic,this.resolutions,this.resolutions_images,this.resolutions_additional,this.variations,this.variations_common,this.fps,this.bitrate,this.bitrate_additional,this.bitrate_additional2,this.bitrate_additional3,this.picsets,this.request,this.virtual_gear,this.virtual_gear2,this.virtual_reality],this.patterns_games=[this.games],this.patterns_for_raw=_.without(this.patterns_video,this.virtual_reality),this.pack_mirror={engine:MirrorEngine,container_patterns:[/()(\[)([^\]]+?)(\])(s)$/g,/()(\[)(.+?)(\])([-, ]*)/g,/()(\()(.+?)(\))([-, ]*)/g,/()(\{)(.+?)(\})([-, ]*)/g],patterns:{video:t.patterns_video,games:t.patterns_games},trimmers:t.trimmers},this.pack_cutting={engine:CuttingEngine,container_patterns:[/(\*)/],patterns:{video:t.patterns_video,games:t.patterns_games},trimmers:t.trimmers},this.pack_raw={engine:RawEngine,container_patterns:[null],patterns:{video:t.patterns_for_raw,games:t.patterns_for_raw},trimmers:t.trimmers},this.is_not_empty=function(t){return t.hits.length},this.parse_pack=function(e,n,i){var r;r="games.apps"==i?n.patterns.games:n.patterns.video;var a=new n.engine(r,n.trimmers),o=n.container_patterns.map(function(t){var n=a.parse(e,t);return e=n.title,n.containers});return o=_.flatten(o,!0),o=o.filter(t.is_not_empty),{title:e,containers:o}},this.compare=function(t,e){return t<e?-1:t>e?1:0},this.compare_hits=function(e,n){return t.compare(e.rank,n.rank)},this.add_rank_boundaries=function(t){var e=_.pluck(t.hits,"rank");t.rank_min=Math.min.apply(null,e)},this.parse=function(e,n){e=e.trim();var i=t.parse_pack(e,t.pack_mirror,n);e=i.title;var r=t.parse_pack(e,t.pack_cutting,n);e=r.title;var a=t.parse_pack(e,t.pack_raw,n);return{title:e=a.title,containers:_.flatten([i.containers,r.containers,a.containers],!0)}},this.simplify=function(e){var n=_.flatten(_.pluck(e.containers,"hits"),!0),i=_.pluck(n.sort(t.compare_hits),"match");return{title:e.title,hits:i}}}function Version(t,e,n,i){var r=this;this.symbol_check="✓",this.symbol_warning="⚑",this.symbol_bookmark="★",this.symbol_freeleech="∞",this.icon_freeleech=['<img src="static/common/symbols/freedownload.gif"','class="collapsed-freeleech"','alt="Freeleech"','title="Unlimited Freeleech">'].join(" "),this.icon_reported=['<span title="This torrent will be automatically deleted unless the uploader fixes it"','class="icon icon_warning collapsed_warning">',"</span>"].join(" "),this.use_freeleech_icon=n,this.use_warning_icon=i,this.$title=null,this.reduced_title=null,this._get_$checkbox=function(){return e.find("input[type=checkbox]")},this._get_$title=function(){return e.find('a[href^="torrents.php?id"], a[href^="/torrents.php?id"]')},this._get_$comments=function(){return e.find([".cats_col  + td + td + td",".cats_cols + td + td + td"].join(", "))},this._get_$tags_container=function(){return e.find(".tags")},this._get_$tags=function(){return e.find(".tags a")},this._get_$check_icon=function(){return e.find("span > span.icon_okay")},this._get_$warning_icon=function(){return e.find("span > span.icon_warning")},this._get_$bookmark_icon=function(){return e.find("span > img[alt=bookmarked]")},this._get_$freeleech_icon=function(){return e.find("span > img[alt=Freeleech]")},this._get_$download_icon=function(){return e.find('span > a[href^="torrents.php?action=download"]')},this._get_$category=function(){return e.find(".cats_col > div")},this.apply_mp4s_workaround=function(e){var n=_.findWhere(e,{after:"s"});if(void 0!==n){var i=_.findWhere(e,{rank_min:t.resolutions.rank});void 0!==i&&(i.after=n.after,n.after="")}},this._get_name=function(){if(!r.containers.length)return"";var t=_.sortBy(r.containers,"rank_min");return _.pluck(t,"tag").join(" ")},this._init=function(){r.$checkbox=r._get_$checkbox(),r.$title=r._get_$title(),r.$comments=r._get_$comments(),r.$tags=r._get_$tags(),r.$tags_container=r._get_$tags_container(),r.$check_icon=r._get_$check_icon(),r.$warning_icon=r._get_$warning_icon(),r.$bookmark_icon=r._get_$bookmark_icon(),r.$freeleech_icon=r._get_$freeleech_icon(),r.$download_icon=r._get_$download_icon(),r.$category=r._get_$category();var e=r.$title.text(),n=r.$category.attr("title"),i=t.parse(e,n);r.reduced_title=i.title.replace(/\s+/g," "),r.containers=i.containers,r.containers.forEach(t.add_rank_boundaries),r.apply_mp4s_workaround(r.containers),r.containers.forEach(r._add_tag),r.name=r._get_name()},this.toggle_checkbox=function(t){r.$checkbox.prop("checked",t)},this._add_tag=function(t){var e=_.sortBy(t.hits,"rank"),n=_.pluck(e,"match").join(", ");t.tag="["+n+"]"+(t.after||"")},this._version_title=function(){var t=[],e=[];r.name&&t.push(r.name),r.$check_icon.length&&t.push(r.symbol_check),r.$warning_icon.length&&(r.use_warning_icon?e.push(r.icon_reported):t.push(r.symbol_warning)),r.$bookmark_icon.length&&t.push(r.symbol_bookmark),r.$freeleech_icon.length&&(r.use_freeleech_icon?e.push(r.icon_freeleech):t.push(r.symbol_freeleech));var n=r.$title.clone();return n.addClass("collapsed-title"),n.text(t.join(" ")||" "),e.forEach(function(t){n.append(t)}),n},this._comments_link=function(){var t=jQuery('<a class="comment"></a>');return t.text(r.$comments.text().trim()),t.attr("href",r.$title.attr("href")+"#thanksdiv"),t},this.collapse=function(){r.collapse=null;var t=jQuery('<div class="version"></div>');return r.$download_icon.length&&t.append(r.$download_icon.clone()),t.append(r._version_title()),!r.$checkbox.length&&parseInt(r.$comments.text())>0&&t.append(r._comments_link()),t},this.hide=function(){e.addClass("collapse-hidden")},this._init()}function Group(t){var e=this;this.versions=[],this.add_version=function(t){e.versions.push(t)},this.compare=function(t,e){return t<e?-1:t>e?1:0},this.compare_mixed=function(t,n){var i=t.match(/\d+/g)||[],r=n.match(/\d+/g)||[];if(i.length&&r.length){for(var a=Math.min(i.length,r.length),o=0;o<a;o++){var s=parseInt(i[o]),c=parseInt(r[o]);if(isNaN(s)||isNaN(c))break;var l=e.compare(s,c);if(0!==l)return l}return e.compare(t,n)}return i.length||r.length?i.length?1:-1:e.compare(t,n)},this.compare_versions=function(t,n){var i=t.name,r=n.name;return e.compare_mixed(i,r)},this.compare_tags=function(t,n){return e.compare(t.name,n.name)},this._convert_tag=function(){return{name:jQuery(this).text(),elem:this}},this._convert_tags=function(t){return t.map(e._convert_tag).get()},this._missing_tags=function(t){var n=e._convert_tags(t[0].$tags),i=_.pluck(t.slice(1),"$tags");return i=i.map(e._convert_tags),i=_.flatten(i,!0),n.sort(e.compare_tags),i.sort(e.compare_tags),i=_.uniq(i,!0,function(t){return t.name}),difference_fast(i,n,e.compare_tags)},this.collapse=function(n){e.collapse=null;var i=e.versions.sort(e.compare_versions).reverse();_.invoke(i.slice(1),"hide");var r=_.invoke(i,"collapse");if(i[0].$title.after(r),i[0].$title.text(t),i[0].$title.parent().find("br").remove(),i[0].$checkbox.change(function(t){var e=t.currentTarget.checked;_.invoke(i.slice(1),"toggle_checkbox",e)}),i.length&&n){var a=e._missing_tags(i);a.length&&_.pluck(a,"elem").forEach(function(t){i[0].$tags_container.append(" ",jQuery(t).clone())})}}}function CollapseDuplicates(t,e,n,i){var r=this;this.groups={},this.get_group=function(t){var e=r.groups[t];return void 0===e&&(e=new Group(t),r.groups[t]=e),e},this.create_group=function(e,a){var o=new Version(t,jQuery(a),n,i);r.get_group(o.reduced_title).add_version(o)},this.create_groups=function(){jQuery(".torrent_table").find("tr.torrent").each(r.create_group)},this.collapse_group=function(t){t.collapse(e)},this.collapse_groups=function(){_.each(r.groups,r.collapse_group)},this.create_groups(),this.collapse_groups()}var comment_icon=["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAz","klEQVQoU43QPysEABjH8YfJv8tg8wLEaJTBrhRlUYTFcK/gJpuSN6FkvE0mqywG+Rh1y0km","V1d3SbjHcC7uurv0HZ7h95meEMNrn0XnXqWU7pRMdINDXz9jp6qFX7DbM7Z7MtkBD31BOrB","mRYTmAHBsw5ulcDsAbCtJ12FVq89MQUVqhrCj0TPfmHUmpfsQplSkupp3VWWb5lxJqWU9hB","Nl+8YVzFtWdOlTSg17nU+2G7XlwosPNXXp0Vg3+Nu0I89OB4MQRswMByH+Ab4BEZhLmRFDo","vgAAAAASUVORK5CYII="].join(""),css=["/* hide default icons */",".torrent .cats_col + td > span, .torrent .cats_cols + td > span {","    display: none;","}","/* exception to display .newtorrent flag */",".torrent .cats_col + td > span.newtorrent, .torrent .cats_cols + td > span.newtorrent {","    display: initial;","    margin-right: 0;","}",".torrent.collapse-hidden {","    display: none;","}",".torrent .tags {","    padding-top: 5px;","    padding-left: 0;","}",".torrent .icon {","    float: none;","    margin-left: 0;","    margin-top: 1px;","}",'.torrent a[href^="torrents.php?action=download"] {',"    position: absolute;","    margin-left: 0;","}",".torrent .version .collapsed-title {","    display: inline-block;","    margin-left: 20px;","    margin-bottom: 2px;","}",".collapsed-freeleech, .collapsed_warning {","    position: absolute;","    margin-left: 5px !important;","    top: 2px;","}",".torrent .version {","    white-space: nowrap;","    position: relative;","}",".torrent .version:first-of-type {","    padding-top: 3px;","}",".torrent .tags {","    padding-top: 3px;","}",".torrent .version .comment {","    position: absolute;","    right: 0;",'    background-image: url("'+comment_icon+'");',"    background-repeat: no-repeat;","    background-position: 0 1px;","    padding-left: 19px;","    text-align: right;","","}"].join("\n"),head=document.getElementsByTagName("head")[0],style=document.createElement("style");style.type="text/css",style.textContent=css,head.appendChild(style);var difference_fast=function(t,e,n){for(var i=0,r=0,a=t.length,o=e.length,s=[];i<a&&r<o;)switch(n(t[i],e[r])){case 0:i++,r++;break;case 1:r++;break;case-1:s.push(t[i]),i++}return i<a&&r==o?s.concat(t.slice(t.idx)):s},match_and_remember=function(t,e){for(var n,i=[];n=e.exec(t);)i.push(n);return e.lastIndex=0,i},match_remember_and_collect=function(t,e,n){var i=[];return{reduced_content:e.reduce(function(t,e){for(var r;r=e.regexp.exec(t);){i.push({rank:e.rank,match:r[1]});var a=t.slice(0,r.index),o=t.slice(r.index+r[0].length);t=a.replace(n.right," ")+o.replace(n.left,""),e.regexp.lastIndex=0}return t.replace(n.both,"")},t),hits:i}};new CollapseDuplicates(new TitleParser,!1,!1,!1);
