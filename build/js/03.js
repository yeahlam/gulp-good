'use strict';
!(function() {
	var t = {
		tips: function(t, i, a) {
			a || (a = 1500),
				new hdpop({
					alert: t,
					alert_time: a,
					dw: 'px',
					closeBack: function() {
						i && i();
					}
				});
		},
		formApply: function() {
			var i = $('.iname'),
				a = $('.iphone'),
				e = $('.ipro'),
				n = $('.isex'),
				s = $('.iseal'),
				r = $('.icity'),
				c = $('.icheck'),
				l = $('.submitbtn'),
				p = !1,
				u = /^(13|14|15|18|17)[0-9]{9}$/;
			l.on('click', function() {
				if (1 != p) {
					if (!i.val()) return t.tips('请输入姓名'), !1;
					if (!a.val()) return t.tips('请输入电话'), !1;
					if (!u.test(a.val())) return t.tips('请输入正确的电话'), !1;
					if (!e.val()) return t.tips('请选择省份'), !1;
					if (!r.val()) return t.tips('请选择城市'), !1;
					if (!s.val()) return t.tips('请选择经销商'), !1;
					if (!n.val()) return t.tips('请选择称呼'), !1;
					if (!c.get(0).checked) return void t.tips('请勾选“我同意《个人信息保护声明》”');
					(p = !0),
						comm.cors({
							url:
								'http://survey.pcauto.com.cn/auto/channelSubmit.jsp?req_enc=utf-8&resp_enc=utf-8',
							data: {
								q_58422: i.val(),
								q_58428: a.val(),
								q_58423: e.val(),
								q_58424: n.val(),
								q_58425: s.val(),
								q_58429: r.val(),
								withCookie: 'true',
								id: 16276
							},
							success: function(i) {
								0 == i.code ? t.tips('报名成功') : t.tips('提交失败'), (p = !1);
							}
						});
				}
			});
		},
		init: function() {
			new zt.SelectN({ id: 'select1' }), this.formApply();
			var t = '';
			for (var i in data)
				t +=
					'<li><span class="a20l1">' +
					data[i].key_2 +
					'</span><span class="a20l2">' +
					data[i].key_3 +
					'</span><span class="a20l3">' +
					data[i].key_4 +
					'</span></li>';
			$('.area20 ul').html(t);
			var a = Lazy.create({
				lazyId: 'Jimg_load',
				trueSrc: '#src',
				offset: 1,
				imgLoad: function(t, i, a) {}
			});
			Lazy.init(a);
		}
	};
	t.init();
})();
