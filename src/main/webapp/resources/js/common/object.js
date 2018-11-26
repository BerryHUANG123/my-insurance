var commonObject = (function ($, W, D) {

    return {
        hobby: {
            sports: {
                cn_name: '运动',
                special_hobby: {
                    sports_basketball: {
                        cn_name: '篮球'
                    },
                    sports_football: {
                        cn_name: '足球'
                    },
                    sports_pangball: {
                        cn_name: '乒乓球'
                    },
                    sports_tennis: {
                        cn_name: '网球'
                    },
                    sports_volleyball: {
                        cn_name: '排球'
                    },
                    sports_badminton: {
                        cn_name: '羽毛球'
                    },
                    sports_run: {
                        cn_name: '跑步'
                    },
                    sports_swimming: {
                        cn_name: '游泳'
                    },
                    sports_skating: {
                        cn_name: '滑冰'
                    },
                    sports_other: {
                        cn_name: '其他'
                    }
                }
            },
            travel: {
                cn_name: '旅行',
                special_hobby: {
                    travel_red_classics: {
                        cn_name: '红色经典'
                    },
                    travel_landscape_humanities: {
                        cn_name: '风景人文'
                    },
                    travel_ethnic_customs: {
                        cn_name: '民族风俗'
                    },
                    travel_other: {
                        cn_name: '其他'
                    }
                }
            },
            music: {
                cn_name: '音乐',
                special_hobby: {
                    music_popular: {
                        cn_name: '流行'
                    },
                    music_classical: {
                        cn_name: '古典'
                    },
                    music_rock: {
                        cn_name: '摇滚'
                    },
                    music_light: {
                        cn_name: '轻'
                    },
                    music_other: {
                        cn_name: '其他'
                    }
                }
            },
            dance: {
                cn_name: '舞蹈',
                special_hobby: {
                    dance_ballet: {
                        cn_name: '芭蕾'
                    },
                    dance_folk: {
                        cn_name: '民族'
                    },
                    dance_modern: {
                        cn_name: '现代'
                    },
                    dance_tap: {
                        cn_name: '踢踏'
                    },
                    dance_jazz: {
                        cn_name: '爵士'
                    },
                    dance_ballroom: {
                        cn_name: '交际'
                    },
                    dance_other: {
                        cn_name: '其他'
                    }
                }
            },
            drink_tea: {
                cn_name: '饮茶',
                special_hobby: {
                    drink_tea_green_tea: {
                        cn_name: '绿茶'
                    },
                    drink_tea_red_tea: {
                        cn_name: '红茶'
                    },
                    drink_tea_oolong_tea: {
                        cn_name: '乌龙茶'
                    },
                    drink_tea_tuo_tea: {
                        cn_name: '沱茶'
                    },
                    drink_tea_other: {
                        cn_name: '其他'
                    }
                }
            },
            musical_instrument: {
                cn_name: '乐器',
                special_hobby: {
                    musical_instrument_guitar: {
                        cn_name: '吉他'
                    },
                    musical_instrument_harmonica: {
                        cn_name: '口琴'
                    },
                    musical_instrument_piano: {
                        cn_name: '钢琴'
                    },
                    musical_instrument_organ: {
                        cn_name: '风琴'
                    },
                    musical_instrument_violin: {
                        cn_name: '小提琴'
                    },
                    musical_instrument_other: {
                        cn_name: '其他'
                    }
                }
            },
            board_games: {
                cn_name: '棋类',
                special_hobby: {
                    board_games_military_chess: {
                        cn_name: '军棋'
                    },
                    board_games_chinese_chess: {
                        cn_name: '中国象棋'
                    },
                    board_games_gobang: {
                        cn_name: '五子棋'
                    },
                    board_games_checkers: {
                        cn_name: '跳棋'
                    },
                    board_games_go: {
                        cn_name: '围棋'
                    },
                    board_games_other: {
                        cn_name: '其他'
                    }
                }
            },
            movies: {
                cn_name: '影视',
                special_hobby: {
                    movies_film: {
                        cn_name: '电影'
                    },
                    movies_sitcom: {
                        cn_name: '连续剧'
                    },
                    movies_short_play: {
                        cn_name: '短剧'
                    },
                    movies_theatre: {
                        cn_name: '戏剧'
                    },
                    movies_other: {
                        cn_name: '其他'
                    }
                }
            },
            read: {
                cn_name: '阅读',
                special_hobby: {
                    read_literature: {
                        cn_name: '文学'
                    },
                    read_philosophy: {
                        cn_name: '哲学'
                    },
                    read_economics: {
                        cn_name: '经济'
                    },
                    read_politics: {
                        cn_name: '政治'
                    },
                    read_novel: {
                        cn_name: '小说'
                    },
                    read_comic: {
                        cn_name: '动漫'
                    },
                    read_other: {
                        cn_name: '其他'
                    }
                }
            },
            social_contact: {
                cn_name: '社交',
                special_hobby: {
                    social_contact_party: {
                        cn_name: '聚会'
                    },
                    social_contact_bodybuilding: {
                        cn_name: '健身'
                    },
                    social_contact_other: {
                        cn_name: '其他'
                    }
                }
            },
            other: {
                cn_name: '其他'
            },
            getParentHobbyList: function () {
                return [
                    {
                        key: 'sports',
                        cn_name: '运动'
                    },
                    {
                        key: 'travel',
                        cn_name: '旅行'
                    },
                    {
                        key: 'music',
                        cn_name: '音乐'
                    },
                    {
                        key: 'dance',
                        cn_name: '舞蹈'
                    },
                    {
                        key: 'drink_tea',
                        cn_name: '饮茶'
                    },
                    {
                        key: 'musical_instrument',
                        cn_name: '乐器'
                    },
                    {
                        key: 'board_games',
                        cn_name: '棋类'
                    },
                    {
                        key: 'movies',
                        cn_name: '影视'
                    },
                    {
                        key: 'read',
                        cn_name: '阅读'
                    },
                    {
                        key: 'social_contact',
                        cn_name: '社交'
                    },
                    {
                        key: 'other',
                        cn_name: '其他'
                    }
                ];
            },
            getChildHobbyList: function (parentHobbyKey) {
                var childHobbyList = [];
                switch (parentHobbyKey) {
                    case 'sports':
                        $.each(this.sports.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'travel':
                        $.each(this.travel.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'music':
                        $.each(this.music.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'dance':
                        $.each(this.dance.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'drink_tea':
                        $.each(this.drink_tea.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'musical_instrument':
                        $.each(this.musical_instrument.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'board_games':
                        $.each(this.board_games.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'movies':
                        $.each(this.movies.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'read':
                        $.each(this.read.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    case 'social_contact':
                        $.each(this.social_contact.special_hobby, function (key, object) {
                            childHobbyList.push({
                                key: key,
                                cn_name: object.cn_name
                            });
                        });
                        break;
                    default:
                }
                return childHobbyList;
            },
            getParentHobbyName: function (parentHobbyKey) {
                switch (parentHobbyKey) {
                    case 'sports':
                        return this.sports.cn_name;
                    case 'travel':
                        return this.travel.cn_name;
                    case 'music':
                        return this.music.cn_name;
                    case 'dance':
                        return this.dance.cn_name;
                    case 'drink_tea':
                        return this.drink_tea.cn_name;
                    case 'musical_instrument':
                        return this.musical_instrument.cn_name;
                    case 'board_games':
                        return this.board_games.cn_name;
                    case 'movies':
                        return this.movies.cn_name;
                    case 'read':
                        return this.read.cn_name;
                    case 'social_contact':
                        return this.social_contact.cn_name;
                    case 'other':
                        return this.other.cn_name;
                    default:
                        return null;
                }
            },
            getChildHobbyName: function (childHobbyKey) {
                switch (childHobbyKey) {

                    /*运动*/
                    case 'sports_basketball':
                        return this.sports.special_hobby.sports_basketball.cn_name;
                    case 'sports_football':
                        return this.sports.special_hobby.sports_football.cn_name;
                    case 'sports_pangball':
                        return this.sports.special_hobby.sports_pangball.cn_name;
                    case 'sports_tennis':
                        return this.sports.special_hobby.sports_tennis.cn_name;
                    case 'sports_volleyball':
                        return this.sports.special_hobby.sports_volleyball.cn_name;
                    case 'sports_badminton':
                        return this.sports.special_hobby.sports_badminton.cn_name;
                    case 'sports_run':
                        return this.sports.special_hobby.sports_run.cn_name;
                    case 'sports_swimming':
                        return this.sports.special_hobby.sports_swimming.cn_name;
                    case 'sports_skating':
                        return this.sports.special_hobby.sports_skating.cn_name;
                    case 'sports_other':
                        return this.sports.special_hobby.sports_other.cn_name;

                    /*旅行*/
                    case 'travel_red_classics':
                        return this.travel.special_hobby.travel_red_classics.cn_name;
                    case 'travel_landscape_humanities':
                        return this.travel.special_hobby.travel_landscape_humanities.cn_name;
                    case 'travel_ethnic_customs':
                        return this.travel.special_hobby.travel_ethnic_customs.cn_name;
                    case 'travel_other':
                        return this.travel.special_hobby.travel_other.cn_name;

                    /*音乐*/
                    case 'music_popular':
                        return this.music.special_hobby.music_popular.cn_name;
                    case 'music_classical':
                        return this.music.special_hobby.music_classical.cn_name;
                    case 'music_rock':
                        return this.music.special_hobby.music_rock.cn_name;
                    case 'music_light':
                        return this.music.special_hobby.music_light.cn_name;
                    case 'music_other':
                        return this.music.special_hobby.music_other.cn_name;

                    /*舞蹈*/
                    case 'dance_ballet':
                        return this.dance.special_hobby.dance_ballet.cn_name;
                    case 'dance_folk':
                        return this.dance.special_hobby.dance_folk.cn_name;
                    case 'dance_modern':
                        return this.dance.special_hobby.dance_modern.cn_name;
                    case 'dance_tap':
                        return this.dance.special_hobby.dance_tap.cn_name;
                    case 'dance_jazz':
                        return this.dance.special_hobby.dance_jazz.cn_name;
                    case 'dance_ballroom':
                        return this.dance.special_hobby.dance_ballroom.cn_name;
                    case 'dance_other':
                        return this.dance.special_hobby.dance_other.cn_name;

                    /*饮茶*/
                    case 'drink_tea_green_tea':
                        return this.drink_tea.special_hobby.drink_tea_green_tea.cn_name;
                    case 'drink_tea_red_tea':
                        return this.drink_tea.special_hobby.drink_tea_red_tea.cn_name;
                    case 'drink_tea_oolong_tea':
                        return this.drink_tea.special_hobby.drink_tea_oolong_tea.cn_name;
                    case 'drink_tea_tuo_tea':
                        return this.drink_tea.special_hobby.drink_tea_tuo_tea.cn_name;
                    case 'drink_tea_other':
                        return this.drink_tea.special_hobby.drink_tea_other.cn_name;

                    /*乐器*/
                    case 'musical_instrument_guitar':
                        return this.musical_instrument.special_hobby.musical_instrument_guitar.cn_name;
                    case 'musical_instrument_harmonica':
                        return this.musical_instrument.special_hobby.musical_instrument_harmonica.cn_name;
                    case 'musical_instrument_piano':
                        return this.musical_instrument.special_hobby.musical_instrument_piano.cn_name;
                    case 'musical_instrument_organ':
                        return this.musical_instrument.special_hobby.musical_instrument_organ.cn_name;
                    case 'musical_instrument_violin':
                        return this.musical_instrument.special_hobby.musical_instrument_violin.cn_name;
                    case 'musical_instrument_other':
                        return this.musical_instrument.special_hobby.musical_instrument_other.cn_name;

                    /*棋类*/
                    case 'board_games_military_chess':
                        return this.board_games.special_hobby.board_games_military_chess.cn_name;
                    case 'board_games_chinese_chess':
                        return this.board_games.special_hobby.board_games_chinese_chess.cn_name;
                    case 'board_games_gobang':
                        return this.board_games.special_hobby.board_games_gobang.cn_name;
                    case 'board_games_checkers':
                        return this.board_games.special_hobby.board_games_checkers.cn_name;
                    case 'board_games_go':
                        return this.board_games.special_hobby.board_games_go.cn_name;
                    case 'board_games_other':
                        return this.board_games.special_hobby.board_games_other.cn_name;

                    /*影视*/
                    case 'movies_film':
                        return this.movies.special_hobby.movies_film.cn_name;
                    case 'movies_sitcom':
                        return this.movies.special_hobby.movies_sitcom.cn_name;
                    case 'movies_short_play':
                        return this.movies.special_hobby.movies_short_play.cn_name;
                    case 'movies_theatre':
                        return this.movies.special_hobby.movies_theatre.cn_name;
                    case 'movies_other':
                        return this.movies.special_hobby.movies_other.cn_name;

                    /*阅读*/
                    case 'read_literature':
                        return this.read.special_hobby.read_literature.cn_name;
                    case 'read_philosophy':
                        return this.read.special_hobby.read_philosophy.cn_name;
                    case 'read_economics':
                        return this.read.special_hobby.read_economics.cn_name;
                    case 'read_politics':
                        return this.read.special_hobby.read_politics.cn_name;
                    case 'read_novel':
                        return this.read.special_hobby.read_novel.cn_name;
                    case 'read_comic':
                        return this.read.special_hobby.read_comic.cn_name;
                    case 'read_other':
                        return this.read.special_hobby.read_other.cn_name;

                    /*社交*/
                    case 'social_contact_party':
                        return this.social_contact.special_hobby.social_contact_party.cn_name;
                    case 'social_contact_bodybuilding':
                        return this.social_contact.special_hobby.social_contact_bodybuilding.cn_name;
                    case 'social_contact_other':
                        return this.social_contact.special_hobby.social_contact_other.cn_name;

                    default:
                        return null;
                }
            }
        }
    };

})(jQuery, window, document);