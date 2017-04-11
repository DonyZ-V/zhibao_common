'use strict';
//重置Map
var Map = function() {
	var arryMap = []
	return {
		set:function(ids,value) {
			arryMap[ids] = value
//						var oneMap = '{'+ ids + ':"' + value + '"}'
//						oneMap =  eval("("+oneMap+")");
//						arryMap.push(oneMap)
		},
		get:function(ids) {
			if (!!arryMap[ids]) {

			    return arryMap[ids]
			} else {
				console.error('Map not fount id')
			}
		},
		has:function(id) {
			var self = this
			if (!!self.get(id)) {
				return true
			} else {
				return false
			}
		},
		all:function() {
			return arryMap
		}
	}
}
var Util = {};
var App = function () {

	var $pagePopup = $('#page-popup');
	var $pagePopupName = $pagePopup.find('#pageHeader .name a');
	var $pagePopupContent = $pagePopup.find('#pageBody .container');
	var mychart;
	return {
		init: function init() {
			var self = this;
			self.bindEvent();
			self.bindUser();
		},
		yunbaSet: function() {
			var self = this
			var yunba = new Yunba({ server: 'sock.yunba.io', port: 3000, appkey: '57cf621d6bc400044f63b390' })
			var userid = 'teacher_' + JSON.parse(localStorage.getItem('user')).id
			var msgNum = localStorage.getItem('msgNum') || 0
			var navNum = $(".nav-msg-num")
			if(msgNum > 0) {
//				navNum.css("display", "none")
				navNum.css("display", "block")
			}
			navNum.text(msgNum)

			//设置连接服务器
			yunba.init(function(success) {
				if(success) {
					yunba.connect_by_customid(userid, function(success, msg, sessionid) {
						if(success) {

						} else {
							console.log(msg);
						}
					});
				}
			});
						//设置收到消息时的回调
			yunba.set_message_cb(function(data) {
				App.bindShowtip('您收到一条消息，请查看', 'warning')
				var urlPage = self.checkUrl()
				if(urlPage === 'message.html') {
					console.log('this is message html')
					message.geteMail()
				} else {
				  msgNum++;
				  navNum.text(msgNum);
			      navNum.css("display", "block");
				  localStorage.setItem('msgNum', msgNum);
				}
			});

			//设置alias
			yunba.set_alias({ 'alias': userid }, function(data) {
				if(!data.success) {
					console.log(data.msg);
				}
			});
		},
		checkUrl() {
			var urls = window.location.pathname
			urls = urls.split('/')
			var pageName = urls.pop()
			return pageName
//			console.log(pageName)
		},
		// 消息框
		bindShowtip: function (content, status) {
			content = content || '恭喜您，成功保存'
			status = status || 'success'
			$('.public-tip span').html(content)
			switch(status) {
				case 'success':
					status = 'fa fa-check ' + status
				break;
				case 'warning':
					status = 'fa fa-warning ' + status
				break;
				case 'error':
					status = 'fa fa-times ' + status
				break;
			}
			$('.public-tip i').attr('class', status)
			$('.public-tip').animate({
				opacity: '1',
				top: '5%'
			}, 'slow')
			$('.public-tip').animate({
				opacity: '1',
				top: '5%'
			},1000)
			$('.public-tip').animate({
				opacity:'0',
				top:'0%'
				}, "slow", function () {
					$(this).attr('style', '')
			});
		},
		bindSvgToImg: function bindSvgToImg() {
			var self = this;
			var id = self.bindGetUrl();
			var imgSrc = mychart.getDataURL({
				pixelRatio: 2,
				backgroundColor: '#fff',
				excludeComponents: ['toolbox']
			});
			var data = {};
			data.id = id;
			data.cardiograph = imgSrc;
			var fun = function fun(r) {
				window.location = 'save_end.html?id=' + id;
			};
			var erro = function erro(r) {
				$('.btn-package i').css('display', 'none');
			};
			api.bindPost(data, 'saveImgCard', fun);
		},
		bindEvent: function bindEvent() {
			var self = this;
			$pagePopup.on('click', '.close-btn', function () {
				$pagePopup.hide();
				$('.container textarea').each(function () {
					// console.log(this.scrollHeight);
					if (this.scrollHeight >= 48) {
						this.setAttribute('style', 'height:' + this.scrollHeight + 'px;overflow-y:hidden;min-height:22px;');
					} else if (this.scrollHeight < 48) {
						this.setAttribute('style', 'height:22px;overflow-y:hidden;min-height:22px;');
					}
				});
				$(".to-top").css("display", "none");
				self.bindhideElement();
			});
			$('.jk-meiqia').on('click',function() {
				_MEIQIA('showPanel');
			})
			$(".page-menu a").on('click', function () {
				var $this = $(this);
				var id = self.bindGetUrl();
				var urls = $this.attr("data-href");
				window.location = urls + "?id=" + id;
			});
			$('.exit').on('click', function () {
//				localStorage.removeItem("token");
//				localStorage.removeItem("JK-USER-ID");
//				localStorage.removeItem("user");
				localStorage.clear()
				window.location = '/templates/auth/login.html';
			});
			//置顶按钮
			$(".to-top").on("click", function () {
				$('.page-wrapper,.page-main-activity,#pageBody,#pageBody .lunbo_main').animate({ scrollTop: '0px' }, 200);
			});
			$('.page-wrapper,.page-main-activity,#pageBody').scroll(function () {
				if ($('.page-wrapper').scrollTop() > 200 || $('.page-main-activity').scrollTop() > 200) {
					$(".to-top").css({ "display": "block", "right": "57px" });
				} else {
					$(".to-top").css("display", "none");
				}
				console.log($('#pageBody .lunbo_main').scrollTop());
				if ($('#pageBody').scrollTop() > 200) {
					var rigth = parseInt($('#pageBody').css('margin-right')) + 8;
					console.log(rigth);
					$(".to-top").css({ "display": "block", "right": rigth + "px" });
				}
			});
			$(document).on('click',function(){
				_MEIQIA('hidePanel')
			})
			//操作提示，点击下一步
			$('body').on('click','.tips-box,.tips-ppt',function(){
				console.log('下一步');

				$(this).find('img:visible').eq(0).hide();
				if($(this).find('img:visible').length<=0){
					$(this).hide();
				}
			});
		},
		bindUser: function bindUser() {
			var user = localStorage.getItem("user");
			if (!!user) {
				user = eval("(" + user + ")");
//				console.log(user);
				//      		$(".am-user-name").html(user.username)
				$("header .logo a").css('background-image', 'url(' + user.company_logo + ')');
			} else {
				console.error('用户信息为空，需要重新登陆');
				alert("请退出，重新登录");
			}
		},

		bindGetUrl: function bindGetUrl() {
			var curriculum_id = window.location.search;
			var myexp = /=(\w+)/;
			//获取 连接中的课程id
			curriculum_id = curriculum_id.match(myexp);
			if (curriculum_id == null || curriculum_id == undefined) {
				console.log("没有获取到用户id");
				curriculum_id = "123";
			} else {
				curriculum_id = curriculum_id[1];
			}
//			console.log(curriculum_id);
			return curriculum_id;
		},
		render: function render($target, $tmpl, dataObj) {
			var tmpl = $tmpl.html();
			var html = ejs.render(tmpl, dataObj);
			$target.html(html);
		},
		renderPagePopup: function renderPagePopup($tmpl, data, temp, type) {
			var self = this;
			var name = data.name || '活动';
			var temp = temp || '保存';
			var type = type || '';
//			console.log("type", type);
//			console.log("temp", temp);
			var pagePopup = $pagePopup;
			if (type) {
				console.log("成功添加类别");
				pagePopup.find(".container").attr("class", "container auto-height " + type);
			}
			if (temp == '保存') {
				console.log("加载 了编辑器--------------------------------");
			} else {
				console.log("编辑时：加载了编辑器--------------------------------");
				$tmpl.find('.wangEditor-menu-container').remove();
				$tmpl.find('.texteditor').unwrap('.wangEditor-container');
			}
			$pagePopupName.html(name);
			var tmplData = data.tmplData;
			self.render($pagePopupContent, $tmpl, tmplData);
			console.log('获取内容================',pagePopup)
			pagePopup.show();
			pagePopup.find('.btn_save').html(temp);
			console.log(pagePopup.find(".texteditor").length);
			console.log($('#pageBody .container:not(.clearinput)'));
			$('#pageBody .container:not(.clearinput)').off();
			if (pagePopup.find(".texteditor").length > 0) {
				pagePopup.find(".texteditor").attr('id', "texteditor");
				self.bindeditor();
				pagePopup.find(":text").removeAttr("readonly");
				pagePopup.find("textarea").removeAttr("readonly");
				pagePopup.find("#texteditor").attr("contenteditable", true).blur();
				pagePopup.find(".wangEditor-container").css({ "border-radius": "3px" });
				pagePopup.find(".container.question #texteditor").css({ "height": "150px" });
				pagePopup.find(".container.activity_practice #texteditor").css({ "height": "150px" });
				pagePopup.find(".container.case #texteditor").css({ "height": "200px" });
				$('.container textarea').each(function () {
					if (this.scrollHeight >= 55) {
						this.style.height = 'auto';
					} else {
						this.style.height = '36px';
					}
				});
				//表单验证绑定
				App.bindValidation("#pageBody .container:not(.clearinput)");
				//			    $modal.find(".am-form-group").each(function(){
				//				  	$(this).removeClass("am-form-success am-form-error");
				//				  	$(this).find("input").removeClass("am-field-valid am-field-error");
				//				  	$(this).find("textarea").removeClass("am-field-valid am-field-error");
				//				})
			}
		},
		bindeditor: function bindeditor() {
			var editor1 = new wangEditor('texteditor');
			// 上传图片（举例）
			editor1.config.uploadImgUrl = $api.uploadImage;
			editor1.config.uploadImgFileName = 'uploaded';
//			// 配置自定义参数（举例）
			editor1.config.uploadParams = {
	            "Content-Type":"application/xml"
			};
			editor1.config.withCredentials = false;
//			// 设置 headers（举例）
			editor1.config.uploadHeaders = {
			    'Accept' : 'text/x-json',
			    "JK-TOKEN": localStorage.getItem("token")||"",
			    "JK-USER-ID":  localStorage.getItem("JK-USER-ID")||""
			};
			editor1.config.uploadImgFns = {
				onload:function(resultText, xhr){
	            console.log('上传结束，返回结果为 ' + resultText);
				resultText = JSON.parse(resultText)
	            var editor = this;
	            var originalName = editor.uploadImgOriginalName || '';  // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
	            var img;

	            if(resultText.success){
	            	var path = resultText.r.path;
	                console.log('上传成功，即将插入编辑区域，结果为：' + resultText);

	                // 将结果插入编辑器
	                img = document.createElement('img');
	                img.onload = function () {
	                    var html = '<img src="' + path + '"  style="max-width:100%;"/>';
	                    editor.command(null, 'insertHtml', html);

	                    console.log('已插入图片，地址 ' + path);
	                    img = null;
	                };
	                img.onerror = function () {
	                    console.error('使用返回的结果获取图片，发生错误。请确认以下结果是否正确：' + path);
	                    img = null;
	                };
	                img.src = path;
	            }else{
	            	console.log(resultText)
	            }


				},
				onerror:function(xhr){
					console.log('上传失败')
					console.log(xhr)
				},
			}
			// 隐藏掉插入网络图片功能。该配置，只有在你正确配置了图片上传功能之后才可用。
//			editor1.config.hideLinkImg = true;
			editor1.config.menus = $.map(wangEditor.config.menus, function (item, key) {
				if (item === 'insertcode') {
					return null;
				}
				if (item === 'location') {
					return null;
				}
				if (item === 'emotion') {
					return null;
				}
				if (item === 'source') {
					return null;
				}
				if (item === 'video') {
					return null;
				}
				if (item === 'link') {
					return null;
				}
				if (item === 'unlink') {
					return null;
				}
				return item;
			});

			editor1.create();
		},
		//类似tab效果 ,添加类，同级删除一个类
		bindClassActive: function bindClassActive($this) {
			$this.siblings().removeClass('active');
			$this.addClass('active');
		},
		//隐藏不需要显示的元素
		bindhideElement: function bindhideElement(parent) {
			//案例隐藏
			//			$(parent+" .container.clearinput.case .am-study-head h3:not(:nth-of-type(1))").css("display","none");
			$(parent + " .container.clearinput.case .am-study-head .close-input textarea").each(function () {
				if ($(this).text().trim() == "") {
					$(this).closest("li").css("display", "none");
				} else if ($(this).text().trim() != "") {
					$(this).closest(".close-input").prev("h3").css("display", "inline-block");
					$(this).prev("h3").css("display", "inline-block");
				}
			});
			//案例库隐藏
			//			$(parent+" .container.clearinput.case_lib .am-study-head h3:not(:nth-of-type(1))").css("display","none");
			$(parent + " .container.clearinput.case_lib .am-study-head .close-input textarea").each(function () {
				if ($(this).text().trim() == "") {
					$(this).closest("li").css("display", "none");
				} else if ($(this).text().trim() != "") {
					//					$(this).closest(".close-input").prev("h3").css("display","inline-block");
					$(this).prev("h3").css("display", "inline-block");
				}
			});
			//提问隐藏
			$(parent + " .container.clearinput.question .am-study-head .close-input textarea").each(function () {
				if ($(this).text().trim() == "") {
					$(this).closest("li").css("display", "none");
				}
			});
			//			$(parent+" .container.clearinput.question div#Orid").css("display","none").prev("h3").css("display","none");
			//			$(parent+" .container.clearinput.question div#funnel").css("display","none").prev("h3").css("display","none");
			$(parent + " .container.clearinput.question div#Orid p").css("display", "none");
			$(parent + " .container.clearinput.question div#funnel p").css("display", "none");
			$(parent + " #Orid textarea").each(function () {
				if ($(this).text().trim() != "") {
					//					$(this).closest("div#Orid").css("display","block").prev("h3").css("display","inline-block");
					$(this).closest("ol").prev("p").css("display", "inline");
				}
			});
			$(parent + " #funnel textarea").each(function () {
				if ($(this).text().trim() != "") {
					//					$(this).closest("div#funnel").css("display","block").prev("h3").css("display","inline-block");
					$(this).closest("ol").prev("p").css("display", "block");
				}
			});
			//活动练习隐藏
			//			$(parent+" .container.clearinput.activity_practice .am-study-head h3").css("display","none");
			//活动规则、流程步骤、讲解要点
			$(parent + " .container.clearinput.activity_practice .am-study-head .close-input textarea").each(function () {
				if ($(this).text().trim() == "") {
					$(this).closest("li").css("display", "none");
				} else if ($(this).text().trim() != "") {
					//					$(this).closest(".close-input").prev("div").find("h3").css("display","inline-block");
				}
			});
			//活动物料隐藏
			$(parent + " .container.clearinput.activity_practice .am-study-head .close-input ul li textarea").each(function () {
				if ($(this).text().trim() == "") {
					$(this).closest("li").css("display", "none");
				} else if ($(this).text().trim() != "") {
					//					$(this).closest(".close-input").prevAll(".pop_add_card").prev("h3").css("display","inline-block");
				}
			});
			$(parent + " .container.clearinput.activity_practice .am-study-head .close-input ul .active_result").each(function () {
				if (!$(this).is(":hidden")) {
					//					$(this).closest(".close-input").prevAll(".pop_add_card").prev("h3").css("display","inline-block");
				}
			});
			//游戏库隐藏
			//			$(parent+" .container.clearinput.case_lib .am-study-head h3").css("display","none");
			//活动规则、流程步骤、讲解要点
			$(parent + " .container.clearinput.case_lib .am-study-head .close-input textarea").each(function () {
				if ($(this).text().trim() == "") {
					$(this).closest("li").css("display", "none");
				} else if ($(this).text().trim() != "") {
					//					$(this).closest(".close-input").prev("div").find("h3").css("display","inline-block");
				}
			});
			//活动物料隐藏
			$(parent + " .container.clearinput.case_lib .am-study-head .close-input ul li textarea").each(function () {
				if ($(this).text().trim() == "") {
					$(this).closest("li").css("display", "none");
				} else if ($(this).text().trim() != "") {
					//					$(this).closest(".close-input").prevAll(".pop_add_card").prev("h3").css("display","inline-block");
				}
			});
			$(parent + " .container.clearinput.case_lib .am-study-head .close-input ul .active_result").each(function () {
				if (!$(this).is(":hidden")) {
					//					$(this).closest(".close-input").prevAll(".pop_add_card").prev("h3").css("display","inline-block");
				}
			});
			//编辑器隐藏
			//			$(parent+" .container.clearinput .wangEditor-txt").each(function(){
			//				if($(this).text().trim()==""){
			//					$(this).closest(".wangEditor-container").css('display','none');
			//					$(this).closest(".wangEditor-container").prev('h3').css('display','none');
			//				}else{
			//					$(this).closest(".wangEditor-container").prev('h3').css('display','inline-block');
			//				}
			//			})
			//文本框高度设置
			$(parent + ' .container textarea').each(function () {
				var height = 22;
				if(parent == ".page6"){
					height =35;
				}
				if (this.scrollHeight >= 48) {
					this.setAttribute('style', 'height:' + this.scrollHeight + 'px;overflow-y:hidden;min-height:'+height+'px;');
				} else if (this.scrollHeight < 48) {
					this.setAttribute('style', 'height:'+height+'px;overflow-y:hidden;min-height:'+height+'px;');
				}
			});
		},

		//显示隐藏的元素
		bindshowElement: function bindshowElement() {
			var self = this;
			$pagePopup.find(".container li textarea").each(function () {
				$(this).closest(".close-input").css("display", "inline-block");
				$(this).closest("li").css("display", "list-item");
			});
			$pagePopup.find(".container .am-study-head p.question_title").css("display", "block");
			$pagePopup.find(".container .am-study-head h3").css("display", "inline-block");
			$pagePopup.find(".container #point_input textarea").each(function () {
				if ($(this).text() == "" || $(this).text() == " ") {
					$(this).closest("#point_input").prev("#add_point").text("+");
					$(this).closest(".close-input").css("display", "none");
				} else {
					$(this).closest("#point_input").prev("#add_point").text("-");
					$(this).closest(".close-input").css("display", "inline-block");
				}
			});
			$pagePopup.find(".container #active_input textarea").each(function () {
				if ($(this).text() == "" || $(this).text() == " ") {
					$(this).closest("#active_input").prev("#add_rules").text("+");
					$(this).closest(".close-input").css("display", "none");
				} else {
					$(this).closest("#active_input").prev("#add_rules").text("-");
					$(this).closest(".close-input").css("display", "inline-block");
				}
			});
			$pagePopup.find(".am-study-head h3:nth-of-type(4),.am-study-head h3:nth-of-type(3)").hide();
			$pagePopup.find(".am-study-head #Orid").show();
			$pagePopup.find(".am-study-head #funnel").hide();
			self.bindautoHeight();
		},
		//表单验证
		bindValidation: function bindValidation(form_name) {
			var $form = $(form_name);
			var $tooltip = $('<div id="vld-tooltip">提示信息！</div>');
			$tooltip.appendTo(document.body);
			$form.validator({
				keyboardEvents: 'focusout, change , keyup' });
			var validator = $form.data('amui.validator');

			$form.on('focusin focusout', 'input[type="text"],input[type="password"],input[type="number"],textarea,.wangEditor-txt', function (e) {
				if (e.type === 'focusin') {
					var $this = $(this);
					var offset = $this.offset();
					var msg = '必填项';
					if (!$(e.target).hasClass("wangEditor-txt")) {
						msg = $this.data('foolishMsg') || validator.getValidationMessage($this.data('validity'));
					} else if (!e.target.closest(".case")) {
						msg = '选填项';
					}

					$tooltip.text(msg).show().css({
						left: offset.left + $(this).outerWidth() + 10,
						top: offset.top
					});
				} else {
					$tooltip.hide();
				}
			});
		},
		//文本框输入高度自适应
		bindautoHeight: function bindautoHeight(parent) {
			var parent = parent || '.container';
			$(parent + ' textarea').each(function () {
				if (this.scrollHeight >= 55) {
					this.setAttribute('style', 'height:' + this.scrollHeight + 'px;overflow-y:hidden;min-height:36px;');
				} else if (this.scrollHeight < 55) {
					this.setAttribute('style', 'height:36px;overflow-y:hidden;min-height:36px;');
				}
			}).on('input', function () {
				if (this.scrollHeight > 45) {
					this.style.height = 'auto';
					this.style.height = this.scrollHeight - 10 + 'px';
				}
			});
		},
		//给页面动态添加css样式
		bindLoadStyle: function bindLoadStyle(css) {
			var style = document.createElement("style");
			style.type = "text/css";
			try {
				style.appendChild(document.createTextNode(css));
			} catch (ex) {
				style.styleSheet.cssText = css;
			}
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(style);
		},
		bindPage:function(paginator){
			if(!paginator.total){return '';}
			var page = '';
			page += '<ul class="am-pagination am-pagination-centered">';
			if (paginator.has_prev) {
				page += '<li><a href="#" class="has_prev" data-prevNum=' + paginator.prev_num + '>&laquo;</a></li>';
			} else {
				page += '<li class="am-disabled"><a href="#">&laquo;</a></li>';
			}
			var num = paginator.pages < 10 ? paginator.pages : 10;
			var num_prev = 0;
			if (paginator.page > 9) {
				num_prev = paginator.page - 4;
				num = paginator.pages < paginator.page + 3 ? paginator.pages : paginator.page + 3;
				page += '<li><a href="#" class="msg_page" data-page=' + 1 + '>' + 1 + '</a></li>';
				page += '<li class="am-disabled"><a href="#">...</a></li>';
			}
			for (var i = num_prev; i < num; i++) {
				if (i + 1 == paginator.page) {
					page += '<li class="am-active" data-page=' + (i + 1) + '><a href="#">' + (i + 1) + '</a></li>';
				} else {
					page += '<li><a href="#" class="msg_page" data-page=' + (i + 1) + '>' + (i + 1) + '</a></li>';
				}
			}
			if (num < paginator.pages) {
				page += '<li class="am-disabled"><a href="#">...</a></li>';
				page += '<li><a href="#" class="msg_page" data-page=' + paginator.pages + '>' + paginator.pages + '</a></li>';
			}
			if (paginator.has_next) {
				page += '<li><a href="#" class="has_next" data-nextNum=' + paginator.next_num + '>&raquo;</a></li>';
			} else {
				page += '<li class="am-disabled"><a href="#">&raquo;</a></li>';
			}
			page += '</ul>';
			return page;
		},
		bindEle: function bindEle(data_learnPoint, data_stimulateDegree, data_activityDuration, data_timerShaft) {
			var self = this;
			// 基于准备好的dom，初始化echarts实例
			if (!document.getElementById('ele')) {
				return false;
			};
			mychart = echarts.init(document.getElementById('ele'));
			var option = {
				color: ['#43af5d'],
				animation:false,
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
						lineStyle: {
							color: '#43af5d'
						},
					},
					formatter: '活动名称{c1}<br/>刺激度 ：{c0}<br/>活动时长：{b0}',
					data: ['课程', '刺激度'],
					padding: 10,
					position: function (point, params, dom) {
					    // 固定在顶部
					    return [point[0], '50%'];
					}
				},
				legend: {
					data: ['Step Start']
				},
				grid: {
					left: '4%',
					right: '4%',
					bottom: '1%',
					containLabel: true
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				xAxis: [{
					name: '累计时长',
					nameLocation: 'end',
					type: 'category',
					axisLabel: { interval: 0, show: true },
					boundaryGap: false,
					data: data_timerShaft
				}, {
					name: '课程时长',
					nameLocation: 'end',
					nameGap: 99999,
					type: 'category',
					axisLabel: { interval: 0, show: false },
					boundaryGap: false,
					axisLine: { show: false },
					axisTick: { show: false },
					data: data_activityDuration
				}],
				yAxis: [{
					name: '刺激度',
					type: 'value',
					data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
					min:0,
					max:10,
					splitNumber:10
				}, {
					name: '课程',
					nameLocation: 'end',
					nameGap: 100,
					type: 'category',
					axisLabel: { interval: 0, show: false },
					boundaryGap: false,
					axisLine: { show: false },
					axisTick: { show: false },
					//					    data: ['课程名称','课程一','课程二','课程三'],
					data: data_learnPoint
				}],
				series: [{
					yAxisIndex: 0,
					xAxisIndex: 1,
					name: '刺激度',
					type: 'line',
					step: 'start',
					//			            showSymbol: false,
					data: data_stimulateDegree
				}, {
					yAxisIndex: 1,
					xAxisIndex: 0,
					name: '课程名称',
					type: 'line',
					step: 'start',
					//			            showSymbol: false,
					//			            data: ['课程名称','课程一','课程二','课程三'],
					data: data_learnPoint
				}, {
					yAxisIndex: 1,
					xAxisIndex: 1,
					name: '课程名称',
					type: 'line',
					step: 'start',
					//			            showSymbol: false,
					//			            data: ['课程名称','课程一','课程二','课程三'],
					data: data_learnPoint
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			mychart.setOption(option);
		}

	};
}();
App.init();

(function(m, ei, q, i, a, j, s) {
	m[i] = m[i] || function() {
		(m[i].a = m[i].a || []).push(arguments)
	};
	j = ei.createElement(q),
		s = ei.getElementsByTagName(q)[0];
	j.async = true;
	j.charset = 'UTF-8';
	j.src = 'http://static.meiqia.com/dist/meiqia.js';
	s.parentNode.insertBefore(j, s);
})(window, document, 'script', '_MEIQIA');
_MEIQIA('entId', '49043');
_MEIQIA('withoutBtn');
