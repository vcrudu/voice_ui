/**
 * Created by Victor on 5/16/2016.
 */

(function() {

    "use strict";

    $.event.special.tap.emitTapOnTaphold = false;

    var Layout = ReactMDL.Layout;
    var Header = ReactMDL.Header;
    var HeaderRow = ReactMDL.HeaderRow;
    var HeaderTabs = ReactMDL.HeaderTabs;
    var Tab = ReactMDL.Tab;
    var Content = ReactMDL.Content;
    var Card = ReactMDL.Card;
    var CardTitle  = ReactMDL.CardTitle;
    var CardText  = ReactMDL.CardText;
    var CardMenu   = ReactMDL.CardMenu;
    var IconButton   = ReactMDL.IconButton;
    var Menu = ReactMDL.Menu;
    var MenuItem = ReactMDL.MenuItem;
    var ProgressBar  = ReactMDL.ProgressBar;

    var DateCard = React.createClass({
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
        render: function() {
            return <div className="group-separator" cl><h2 className="mdl-card__title-text">{this.props.title}</h2></div>;
        }
    });

    var InfoCard = React.createClass({
        componentDidUpdate: function() {

        },
        componentDidMount: function() {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});

            var component = this;
            var infoCard = this.refs.infoCard;
            $(infoCard).on("tap", function () {
                if ($(infoCard).find(".material-icons").hasClass("selected")) {
                    $(infoCard).find(".material-icons").text("alarm");
                    $(infoCard).find(".material-icons").removeClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, false, function(result) {

                    });
                }
                else {
                    component.handleView();
                }
            });

            $(infoCard).on("taphold", function(event) {
                event.preventDefault();
                if ($(infoCard).find(".material-icons").hasClass("selected")) {
                    $(infoCard).find(".material-icons").text("alarm");
                    $(infoCard).find(".material-icons").removeClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, false, function(result) {

                    });
                } else
                {
                    $(infoCard).find(".material-icons").text("done");
                    $(infoCard).find(".material-icons").addClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, true, function(result) {

                    });
                }
            });

            if (component.props.isSelected) {
                $(infoCard).find(".material-icons").text("done");
                $(infoCard).find(".material-icons").addClass("selected");
            } else if ($(infoCard).find(".material-icons").hasClass("selected")) {
                $(infoCard).find(".material-icons").text("alarm");
                $(infoCard).find(".material-icons").removeClass("selected");
            }
        },
        handleView: function() {

            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <div ref="infoCard" className="infoCard" id={this.props.serverId}>
                <Card className="message-card-wide mdl-shadow--2dp noselect">
                    <CardText>
                        <div className="notification-title-wrapper">
                            <div className="notification-icon">
                                <i className="material-icons mdl-list__item-avatar info-amber">alarm</i>
                            </div>
                            <div className="notification-title-summary">
                                <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>
                                    {this.props.title}
                                </div>
                                <div ref="cardSummary" className={this.props.isNew ? "notification-summary unread" : "notification-summary read"}>
                                    {this.props.summary}
                                </div>
                            </div>
                        </div>
                        <div className="clear"></div>
                        <div ref="cardMessage" className="notification-message">
                            {this.props.message}
                        </div>
                    </CardText>
                    <CardMenu>
                        <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>{this.props.time}</div>
                    </CardMenu>
                </Card>
            </div>
        }
    });

    var AlarmCard = React.createClass({
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});

            var component = this;
            var alarmCard = this.refs.alarmCard;
            $(alarmCard).on("tap", function () {
                if ($(alarmCard).find(".material-icons").hasClass("selected")) {
                    $(alarmCard).find(".material-icons").text("av_timer");
                    $(alarmCard).find(".material-icons").removeClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, false, function(result) {

                    });
                }
                else {
                    component.handleView();
                }
            });

            $(alarmCard).on("taphold", function(event) {
                event.preventDefault();
                if ($(alarmCard).find(".material-icons").hasClass("selected")) {
                    $(alarmCard).find(".material-icons").text("av_timer");
                    $(alarmCard).find(".material-icons").removeClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, false, function(result) {

                    });
                }
                else {
                    $(alarmCard).find(".material-icons").text("done");
                    $(alarmCard).find(".material-icons").addClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, true, function(result) {

                    });
                }
            });

            if (component.props.isSelected) {
                $(alarmCard).find(".material-icons").text("done");
                $(alarmCard).find(".material-icons").addClass("selected");
            } else if ($(alarmCard).find(".material-icons").hasClass("selected")) {
                $(alarmCard).find(".material-icons").text("av_timer");
                $(alarmCard).find(".material-icons").removeClass("selected");
            }
        },
        handleView: function() {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <div ref="alarmCard" className="alarmCard" id={this.props.serverId}>
                <Card className="message-card-wide mdl-shadow--2dp noselect">
                    <CardText>
                        <div className="notification-title-wrapper">
                            <div className="notification-icon">
                                <i className="material-icons mdl-list__item-avatar alarm">av_timer</i>
                            </div>
                            <div className="notification-title-summary">
                                <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>
                                    {this.props.title}
                                </div>
                                <div ref="cardSummary" className={this.props.isNew ? "notification-summary unread" : "notification-summary read"}>
                                    {this.props.summary}
                                </div>
                            </div>
                        </div>
                        <div className="clear"></div>
                        <div ref="cardMessage" className="notification-message">
                            {this.props.message}
                        </div>
                    </CardText>
                    <CardMenu>
                        <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>{this.props.time}</div>
                    </CardMenu>
                </Card>
            </div>
        }
    });

    var ReadingCard = React.createClass({
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});

            var component = this;
            var readingCard = this.refs.readingCard;
            $(readingCard).on("tap", function () {
                if ($(readingCard).find(".material-icons").hasClass("selected")) {
                    $(readingCard).find(".material-icons").text("done");
                    $(readingCard).find(".material-icons").removeClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, false, function(result) {

                    });
                }
                else {
                    component.handleView();
                }
            });

            $(readingCard).on("taphold", function(event) {
                event.preventDefault();
                if ($(readingCard).find(".material-icons").hasClass("selected")) {
                    $(readingCard).find(".material-icons").text("done");
                    $(readingCard).find(".material-icons").removeClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, false, function(result) {
                    });
                } else {
                    $(readingCard).find(".material-icons").text("done");
                    $(readingCard).find(".material-icons").addClass("selected");

                    Bridge.Timeline.changeSelectedCard(component.props.serverId, true, function(result) {
                    });
                }
            });

            if (component.props.isSelected) {
                $(readingCard).find(".material-icons").text("done");
                $(readingCard).find(".material-icons").addClass("selected");
            } else if ($(readingCard).find(".material-icons").hasClass("selected")) {
                $(readingCard).find(".material-icons").text("done");
                $(readingCard).find(".material-icons").removeClass("selected");
            }

            $(readingCard).height($(readingCard).height());
        },
        handleView: function() {
            var readingCard = this.refs.readingCard;

            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <div ref="readingCard" className="readingCard" id={this.props.serverId}>
                <Card className="message-card-wide mdl-shadow--2dp noselect">
                    <CardText>
                        <div className="notification-title-wrapper">
                            <div className="notification-icon">
                                <i className="material-icons mdl-list__item-avatar reading">done</i>
                            </div>
                            <div className="notification-title-summary">
                                <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>
                                    {this.props.title}
                                </div>
                                <div ref="cardSummary" className={this.props.isNew ? "notification-summary unread" : "notification-summary read"}>
                                    {this.props.summary}
                                </div>
                            </div>
                        </div>
                        <div className="clear"></div>
                        <div ref="cardMessage" className="notification-message">
                            {this.props.message}
                        </div>
                    </CardText>
                    <CardMenu>
                        <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>{this.props.time}</div>
                    </CardMenu>
                </Card>
            </div>
        }
    });

    var PatientTimeline = React.createClass({
        getInitialState: function() {
            return {
                activeTab: 0,
                cards: [],
                allCards: [],
                alarmCards: [],
                infoCards: [],
                readingsCards: []
            }
        },
        componentDidUpdate: function() {
        },
        formatCardDate: function(timeStamp) {
            return moment(timeStamp).format("dddd Do MMM");
        },
        groupCards: function(cards, filteredCards) {
            if (filteredCards && filteredCards.length > 0) {
                var cardDateTime = filteredCards[0].dateTime;
                var momentDateTimeString = moment(cardDateTime).format("YYYYMMDD");

                var dateCard = {
                    id: cardDateTime,
                    title: this.formatCardDate(cardDateTime),
                    dateString: momentDateTimeString,
                    category: "date"
                };

                cards.push(dateCard);

                for(var i = 0; i< filteredCards.length; i++) {
                    cardDateTime = filteredCards[i].dateTime;
                    momentDateTimeString = moment(cardDateTime).format("YYYYMMDD");

                    filteredCards[i].timeString = moment(filteredCards[i].dateTime).format("HH:mm");

                    if (momentDateTimeString == dateCard.dateString) {
                        cards.push(filteredCards[i]);
                    }
                    else {
                        dateCard = {
                            id: cardDateTime,
                            title: this.formatCardDate(cardDateTime),
                            dateString: momentDateTimeString,
                            category: "date",
                        };

                        cards.push(dateCard);
                        cards.push(filteredCards[i]);
                    }
                }
            }
        },
        insertCard:function(cardCollection, notification) {
            if (cardCollection.length === 0) {
                cardCollection.push(notification);
            } else {
                var firstCard = cardCollection[0];
                if (firstCard.dateString && moment(firstCard.dateString) < moment(notification.dateTime)) {
                    cardCollection.splice(0, 0, notification);
                } else {
                    cardCollection.splice(1, 0, notification);
                }
            }
        },
        notificationCallback:function(data) {
            var component = this;
            var notification = data.notification;
            component.setState(function (previousState) {
                notification.timeString = moment(notification.dateTime).format("HH:mm");
                this.insertCard(previousState.cards, notification);
                this.insertCard(previousState.allCards, notification);
                switch (notification.category) {
                    case "info":
                        this.insertCard(previousState.infoCards, notification);
                        break;
                    case "alarm":
                        this.insertCard(previousState.alarmCards, notification);
                        break;
                    case "reading":
                        this.insertCard(previousState.readingsCards, notification);
                        break;
                }

                return previousState;
            });
        },
        deleteNotificationsCallback: function(notifications) {
            for(var i = 0; i < notifications.length; i++) {
                var notificationCard = $("#" + notifications[i].dateTime);
                notificationCard.find("div").first().animate({left: '1000px'}, 300, function() {
                    $(this).parent().fadeOut("fast");
                });
            }
        },
        componentDidMount: function() {
            var component = this;

            Bridge.notificationCallback = this.notificationCallback;
            Bridge.deleteNotificationsCallback = this.deleteNotificationsCallback;

            Bridge.Timeline.clearSelectedCards(function(clearResult) {
                Bridge.Timeline.getNotifications(function (result) {
                    var allCards = _.sortBy(result.data, "dateTime").reverse();
                    var groupedAllCards = [];
                    component.groupCards(groupedAllCards, allCards);

                    var infoCards = _.filter(allCards, function (card) {
                        return card.category == "info";
                    });
                    var groupedInfoCards = [];
                    component.groupCards(groupedInfoCards, infoCards);

                    var alarmCards = _.filter(allCards, function (card) {
                        return card.category == "alarm";
                    });
                    var groupedAlarmCards = [];
                    component.groupCards(groupedAlarmCards, alarmCards);

                    var readingsCards = _.filter(allCards, function (card) {
                        return card.category == "reading";
                    });
                    var groupedReadingsCards = [];
                    component.groupCards(groupedReadingsCards, readingsCards);

                    component.setState({
                        cards: groupedAllCards,
                        allCards: groupedAllCards,
                        infoCards: groupedInfoCards,
                        alarmCards: groupedAlarmCards,
                        readingsCards: groupedReadingsCards,
                        selectedCards: []
                    });

                    $(".mdl-progress").css('visibility', 'hidden');
                });
            });
        },
        componentWillUnmount: function () {
            Bridge.notificationCallback = undefined;
            Bridge.deleteNotificationsCallback = undefined;
        },
        onChange: function(tabId) {
            var component = this;
            Bridge.Timeline.getSelectedCards(function(selectedCards) {
                if (selectedCards.success) {
                    var sCards = selectedCards.data;
                    var allCardsArray = component.state.allCards;
                    for (var i = 0; i < allCardsArray.length; i++){
                        allCardsArray[i].isSelected = false;
                        for (var j = 0; j < sCards.length; j++) {
                            if (sCards[j].dateTime === allCardsArray[i].dateTime) {
                                allCardsArray[i].isSelected = true;
                                break;
                            }
                        }
                    }

                    var infoCardsArray = component.state.infoCards;
                    for (var i = 0; i < infoCardsArray.length; i++){
                        infoCardsArray[i].isSelected = false;
                        for (var j = 0; j < sCards.length; j++) {
                            if (sCards[j].dateTime === infoCardsArray[i].dateTime) {
                                infoCardsArray[i].isSelected = true;
                                break;
                            }
                        }
                    }

                    var alarmCardsArray = component.state.alarmCards;
                    for (var i = 0; i < alarmCardsArray.length; i++){
                        alarmCardsArray[i].isSelected = false;
                        for (var j = 0; j < sCards.length; j++) {
                            if (sCards[j].dateTime === alarmCardsArray[i].dateTime) {
                                alarmCardsArray[i].isSelected = true;
                                break;
                            }
                        }
                    }

                    var readingsCardsArray = component.state.readingsCards;
                    for (var i = 0; i < readingsCardsArray.length; i++){
                        readingsCardsArray[i].isSelected = false;
                        for (var j = 0; j < sCards.length; j++) {
                            if (sCards[j].dateTime === readingsCardsArray[i].dateTime) {
                                readingsCardsArray[i].isSelected = true;
                                break;
                            }
                        }
                    }

                    if (tabId == 0) {
                        component.setState({ activeTab: tabId, cards: allCardsArray });
                    }
                    else if (tabId == 1) {
                        component.setState({ activeTab: tabId, cards: infoCardsArray });
                    }
                    else if (tabId == 2) {
                        component.setState({ activeTab: tabId, cards: alarmCardsArray });
                    }
                    else if (tabId == 3) {
                        component.setState({ activeTab: tabId, cards: readingsCardsArray });
                    }
                }
            });
        },
        render : function() {
            var component = this;
            return  <Layout fixedHeader fixedTabs>
                <Header>
                    <ProgressBar indeterminate ref="progressBar" id="progressBar"/>
                    <HeaderTabs activeTab={this.state.activeTab} onChange={this.onChange} ripple>
                        <Tab href="#tab1">All</Tab>
                        <Tab href="#tab2">Info</Tab>
                        <Tab href="#tab3">Alarms</Tab>
                        <Tab href="#tab4">Readings</Tab>
                    </HeaderTabs>
                </Header>
                <Content>
                    <section id="tab1">
                        <div className="page-content">
                            <div className="page-content-wrapper">
                                {
                                    component.state.cards.map(function (card) {
                                        switch (card.category) {
                                            case "date":
                                                return <DateCard key={card.id + "_date"} title={card.title} cardId={card.id + "_date"}/>
                                            case "info":
                                                return <InfoCard key={card.dateTime + "_all"} serverId={card.dateTime} time={card.timeString} title={card.title} message={card.content} summary={card.summary} cardId={card.dateTime + "_all"} isNew={!card.read} isSelected={card.isSelected}/>
                                            case "alarm":
                                                return <AlarmCard key={card.dateTime + "_all"} serverId={card.dateTime} time={card.timeString} title={card.title} message={card.content} summary={card.summary} cardId={card.dateTime + "_all"} isNew={!card.read} isSelected={card.isSelected}/>
                                            case "reading":
                                                return <ReadingCard key={card.dateTime + "_all"} serverId={card.dateTime} time={card.timeString} title={card.title} message={card.content} summary={card.summary} cardId={card.dateTime + "_all"} isNew={!card.read} isSelected={card.isSelected}/>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </section>
                    <section id="tab2" className="hide"></section>
                    <section id="tab3" className="hide"></section>
                    <section id="tab4" className="hide"></section>
                </Content>
            </Layout>
        }
    });

    ReactDOM.render(<PatientTimeline />, document.getElementById("patient-timeline-2"));
})();
