////////////////////////////////////////////////////////////////////////////////////////
//Page 전역 변수
////////////////////////////////////////////////////////////////////////////////////////
var selectPdServiceId; // 제품 아이디
var selectPdServiceName; // 제품 이름
var selectedIndex; // 데이터테이블 선택한 인덱스
var selectedPage; // 데이터테이블 선택한 인덱스
var selectVersion; // 선택한 버전 아이디
var selectVersionName; // 선택한 버전 이름
var dataTableRef; // 데이터테이블 참조 변수

////////////////////////////////////////////////////////////////////////////////////////
//Document Ready
////////////////////////////////////////////////////////////////////////////////////////
function execDocReady() {

	var pluginGroups = [
		[	"../reference/light-blue/lib/bootstrap-datepicker.js",
			"../reference/jquery-plugins/datetimepicker-2.5.20/build/jquery.datetimepicker.min.css",
			"../reference/jquery-plugins/datetimepicker-2.5.20/build/jquery.datetimepicker.full.min.js",
			"../reference/lightblue4/docs/lib/widgster/widgster.js"],

		[	"../reference/jquery-plugins/select2-4.0.2/dist/css/select2_lightblue4.css",
			"../reference/jquery-plugins/lou-multi-select-0.9.12/css/multiselect-lightblue4.css",
			"../reference/jquery-plugins/multiple-select-1.5.2/dist/multiple-select-bluelight.css",
			"../reference/jquery-plugins/select2-4.0.2/dist/js/select2.min.js",
			"../reference/jquery-plugins/lou-multi-select-0.9.12/js/jquery.quicksearch.js",
			"../reference/jquery-plugins/lou-multi-select-0.9.12/js/jquery.multi-select.js",
			"../reference/jquery-plugins/multiple-select-1.5.2/dist/multiple-select.min.js"],

		[	"../reference/jquery-plugins/dataTables-1.10.16/media/css/jquery.dataTables_lightblue4.css",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Responsive/css/responsive.dataTables_lightblue4.css",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Select/css/select.dataTables_lightblue4.css",
			"../reference/jquery-plugins/dataTables-1.10.16/media/js/jquery.dataTables.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Responsive/js/dataTables.responsive.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Select/js/dataTables.select.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/RowGroup/js/dataTables.rowsGroup.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/dataTables.buttons.min.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/buttons.html5.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/buttons.print.js",
			"../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/jszip.min.js"
		]
		// 추가적인 플러그인 그룹들을 이곳에 추가하면 됩니다.
	];

	loadPluginGroupsParallelAndSequential(pluginGroups)
		.then(function() {

			console.log('모든 플러그인 로드 완료');

			//vfs_fonts 파일이 커서 defer 처리 함.
			setTimeout(function () {
				var script = document.createElement("script");
				script.src = "../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/vfs_fonts.js";
				script.defer = true; // defer 속성 설정
				document.head.appendChild(script);
			}, 5000); // 5초 후에 실행됩니다.

			//pdfmake 파일이 커서 defer 처리 함.
			setTimeout(function () {
				var script = document.createElement("script");
				script.src = "../reference/jquery-plugins/dataTables-1.10.16/extensions/Buttons/js/pdfmake.min.js";
				script.defer = true; // defer 속성 설정
				document.head.appendChild(script);
			}, 5000); // 5초 후에 실행됩니다.

			//사이드 메뉴 처리
			$('.widget').widgster();
			setSideMenu("sidebar_menu_product", "sidebar_menu_version_manage");

			// DatePicker 처리 부분 ( 팝업 레이어 )
			$(".date-picker").datepicker({
				autoclose: true
			});

			// --- 에디터 설정 --- //
			var waitCKEDITOR = setInterval(function () {
				try {
					if (window.CKEDITOR) {
						if(window.CKEDITOR.status == "loaded") {
							CKEDITOR.replace("version_contents", {skin: "office2013"});
							CKEDITOR.replace("input_pdservice_editor", {skin: "office2013"});
							CKEDITOR.replace("extend_modal_editor", {skin: "office2013"});
							clearInterval(waitCKEDITOR);
						}
					}
				} catch (err) {
					console.log("CKEDITOR 로드가 완료되지 않아서 초기화 재시도 중...");
				}
			}, 313 /*milli*/);

			$("#input_pdservice_start_date").datetimepicker({
				allowTimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
			    theme:'dark'
			});

			$("#input_pdservice_end_date").datetimepicker({
				allowTimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
				theme:'dark'
			});

			$("#btn_enabled_date").datetimepicker({
				allowTimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
				theme:'dark'
			});

			$("#btn_end_date").datetimepicker({
				allowTimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
				theme:'dark'
			});

			// --- 데이터 테이블 설정 --- //
			var waitDataTable = setInterval(function() {
				try {
					if (!$.fn.DataTable.isDataTable("#pdservice_table")) {
						dataTableLoad();
						clearInterval(waitDataTable);
					}
				} catch (err) {
					console.log("서비스 데이터 테이블 로드가 완료되지 않아서 초기화 재시도 중...");
				}
			}, 313 /*milli*/);
			// 스크립트 실행 로직을 이곳에 추가합니다.

			click_btn_for_delete_version();
			click_btn_for_update_version();
			init_versionList();

			tab_click_event();

			//라따 버튼 설정
			var 라따적용_클래스이름_배열 = ['.ladda-new-pdservice-version','.ladda-update-pdservice-version','.ladda_delete_pdservice_version'];
			laddaBtnSetting(라따적용_클래스이름_배열);

		})
		.catch(function() {
			console.error('플러그인 로드 중 오류 발생');
		});

}

////////////////////////////////////////////////////////////////////////////////////////
// --- 데이터 테이블 설정 --- //
////////////////////////////////////////////////////////////////////////////////////////
function dataTableLoad() {
	// 데이터 테이블 컬럼 및 열그룹 구성
	var columnList = [
		{ name: "c_id", title: "제품(서비스) 아이디", data: "c_id", visible: false },
		{
			name: "c_title",
			title: "제품(서비스) 이름",
			data: "c_title",
			render: function (data, type, row, meta) {
				if (type === "display") {
					return '<label style="color: #a4c6ff">' + data + "</label>";
				}

				return data;
			},
			className: "dt-body-left",
			visible: true
		}
	];
	var rowsGroupList = [];
	var columnDefList = [];
	var selectList = {};
	var orderList = [[0, "asc"]];
	var buttonList = [
		"copy",
		"excel",
		"print",
		{
			extend: "csv",
			text: "Export csv",
			charset: "utf-8",
			extension: ".csv",
			fieldSeparator: ",",
			fieldBoundary: "",
			bom: true
		},
		{
			extend: "pdfHtml5",
			orientation: "landscape",
			pageSize: "LEGAL"
		}
	];

	var jquerySelector = "#pdservice_table";
	var ajaxUrl = "/auth-user/api/arms/pdService/getPdServiceMonitor.do";
	var jsonRoot = "response";
	var isServerSide = false;

	dataTableRef = dataTable_build(
		jquerySelector,
		ajaxUrl,
		jsonRoot,
		columnList,
		rowsGroupList,
		columnDefList,
		selectList,
		orderList,
		buttonList,
		isServerSide
	);

	$("#copychecker").on("click", function () {
		dataTableRef.button(".buttons-copy").trigger();
	});
	$("#printchecker").on("click", function () {
		dataTableRef.button(".buttons-print").trigger();
	});
	$("#csvchecker").on("click", function () {
		dataTableRef.button(".buttons-csv").trigger();
	});
	$("#excelchecker").on("click", function () {
		dataTableRef.button(".buttons-excel").trigger();
	});
	$("#pdfchecker").on("click", function () {
		dataTableRef.button(".buttons-pdf").trigger();
	});
}

// 데이터 테이블 구성 이후 꼭 구현해야 할 메소드 : 열 클릭시 이벤트
function dataTableClick(tempDataTable, selectedData) {
	$("#version_contents").html(""); // 버전 상세 명세 초기화

	selectPdServiceId = selectedData.c_id;
	selectPdServiceName = selectedData.c_title;
	console.log("selectedData.c_id : ", selectedData.c_id);

	$("#default_non_version").empty();
	$("#default_non_version").css("margin-bottom", "0px");

	dataLoad(selectedData.c_id, selectedData.c_title);
}

//데이터 테이블 ajax load 이후 콜백.
function dataTableCallBack(settings, json) {}

function dataTableDrawCallback(tableInfo) {
	$("#" + tableInfo.sInstance)
		.DataTable()
		.columns.adjust()
		.responsive.recalc();
}


////////////////////////////////////////////////////////////////////////////////////////
// --- 팝업 띄울때 사이즈 조정 -- //
////////////////////////////////////////////////////////////////////////////////////////
function modalPopup(popupName) {
	if (popupName === "modal_popup_id") {
		// modalPopupId = 신규버전 등록하기
		$("#modal_title").text("제품(서비스) 신규 버전 등록 팝업");
		$("#modal_sub").text("선택한 제품(서비스)에 버전을 등록합니다.");
		$("#extendupdate_pdservice_version").attr("onClick", "modalPopupNewUpdate()");
		$("#extendupdate_pdservice_version").text("신규 버전 등록");

		$("#tooltip_enabled_service_version").val("");
		$("#btn_enabled_date").val("");
		$("#btn_end_date").val("");
		CKEDITOR.instances.extend_modal_editor.setData("");
	} else {
		// 편집하기 버튼의 팝업으로 보기
		$("#modal_title").text("제품(서비스) 버전 등록 / 변경");
		$("#modal_sub").text("선택한 제품(서비스)에 버전을 등록/변경 합니다.");
		$("#extendupdate_pdservice_version").attr("onClick", "modalPopupUpdate()");
		$("#extendupdate_pdservice_version").text("버전 정보 변경");

		//팝업 데이터
		$("#tooltip_enabled_service_version").val($("#input_pdservice_version").val());
		$("#btn_enabled_date").val($("#input_pdservice_start_date").val());
		$("#btn_end_date").val($("#input_pdservice_end_date").val());
		var editorData = CKEDITOR.instances["input_pdservice_editor"].getData();
		CKEDITOR.instances.extend_modal_editor.setData(editorData);
	}

	var height = $(document).height() - 800;
	$(".modal-body")
		.find(".cke_contents:eq(0)")
		.css("height", height + "px");
}

////////////////////////////////////////////////////////////////////////////////////////
// 버전 삭제 버튼
////////////////////////////////////////////////////////////////////////////////////////
function click_btn_for_delete_version() {
	$("#del_version").click(function () {
		if (!selectVersion) {
			alert("선택된 버전이 없습니다.");
			return false;
		}

		if (confirm(selectVersionName + " 버전을 삭제하시겠습니까?")) {
			console.log("delete btn");
			$.ajax({
				url: "/auth-user/api/arms/pdService/removeVersion.do",
				type: "DELETE",
				data: {
					pdservice_c_id: selectPdServiceId,
					version_c_id: selectVersion
				},
				statusCode: {
					200: function () {
						console.log("삭제 성공!");
						//모달 팝업 끝내고
						$("#close_version").trigger("click");
						$("#select_version").text("선택되지 않음");
						//버전 데이터 재 로드
						dataLoad(selectPdServiceId, selectPdServiceName);
					}
				}
			});
		}
	});
}

////////////////////////////////////////////////////////////////////////////////////////
// 버전 업데이트 저장 버튼
////////////////////////////////////////////////////////////////////////////////////////
function click_btn_for_update_version() {
	$("#version_update").click(function () {
		console.log("update btn");
		if (modalFormValidate() === false) {
			return;
		}

		var send_data = {
			c_id: selectVersion,
			c_title: $("#input_pdservice_version").val(),
			c_pds_version_contents: CKEDITOR.instances.input_pdservice_editor.getData(),
			c_pds_version_start_date: $("#input_pdservice_start_date").val(),
			c_pds_version_end_date: $("#input_pdservice_end_date").val()
		};
		$.ajax({
			url: "/auth-user/api/arms/pdService/updateVersionToNode.do?pdservice_link=" + selectPdServiceId,
			type: "put",
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(send_data),
			statusCode: {
				200: function () {
					console.log("성공!");
					jSuccess("데이터가 변경되었습니다.");
					//모달 팝업 끝내고
					$("#close_version").trigger("click");
					//버전 데이터 재 로드
					dataLoad(selectPdServiceId, selectPdServiceName);
				}
			}
		});
	});
}

////////////////////////////////////////////////////////////////////////////////////////
//버전 팝업 신규 업데이트
////////////////////////////////////////////////////////////////////////////////////////
function modalPopupNewUpdate() {
	console.log("save btn");
	if (modalFormValidate("") === false) {
		return;
	}

	var send_data = {
		c_id: selectPdServiceId,
		pdServiceVersionEntities: [
			{
				ref:2,
				c_type: 'default',
				c_title: $("#tooltip_enabled_service_version").val(),
				c_pds_version_contents: CKEDITOR.instances.extend_modal_editor.getData(),
				c_pds_version_start_date: $("#btn_enabled_date").val(),
				c_pds_version_end_date: $("#btn_end_date").val()
			}
		]
	};

	$.ajax({
		url: "/auth-user/api/arms/pdService/addVersionToNode.do",
		type: "POST",
		contentType : 'application/json; charset=utf-8',
		data: JSON.stringify(send_data),
		statusCode: {
			200: function () {
				//모달 팝업 끝내고
				jSuccess("데이터가 저장되었습니다.");
				$("#close_version").trigger("click");
				//버전 데이터 재 로드
				dataLoad(selectPdServiceId, selectPdServiceName);
			}
		}
	});
}

////////////////////////////////////////////////////////////////////////////////////////
// 버전 팝업 수정 업데이트
////////////////////////////////////////////////////////////////////////////////////////
function modalPopupUpdate() {
	console.log("modalPopupUpdate");
	if (modalFormValidate("") === false) {
		return;
	}

	$.ajax({
		url: "/auth-user/api/arms/pdServiceVersion/updateNode.do",
		type: "put",
		data: {
			c_id: selectVersion,
			c_title: $("#tooltip_enabled_service_version").val(),
			c_pds_version_contents: CKEDITOR.instances.extend_modal_editor.getData(),
			c_pds_version_start_date: $("#btn_enabled_date").val(),
			c_pds_version_end_date: $("#btn_end_date").val()
		},
		statusCode: {
			200: function () {
				console.log("성공!");
				jSuccess("데이터가 변경되었습니다.");
				//모달 팝업 끝내고
				$("#close_version").trigger("click");
				//버전 데이터 재 로드
				dataLoad(selectPdServiceId, selectPdServiceName);
			}
		}
	});
}
////////////////////////////////////////////////////////////////////////////////////////
//버전 등록,수정 관련 3가지 케이스에 대한 유효성 검증
//모달 여부에 따라 form이 정해지고, 해당 form 하위의 required 속성을 가진 input 태그를 모두 체크합니다.
////////////////////////////////////////////////////////////////////////////////////////
function modalFormValidate(formId) {
	console.log("modalFormValidate");
	if(formId === "") {
		// 모달 form
		return formValidate($('.product-service-version-modal-form').find('input[required]'));
	} else {
		// 일반 form
		return formValidate($('.product-service-version-form').find('input[required]'));
	}

}
function formValidate(formInput) {
	console.log("formValidate");
	let startDateElement;
	let endDateElement;

	for (let i = 0; i < formInput.length; i++) {
		let input = $(formInput[i]);

		if (input.hasClass('input_pdservice_start_date')) {
			startDateElement = input;
		}

		if (input.hasClass('input_pdservice_end_date')) {
			endDateElement = input;
		}

		if (!input.val().trim()) {
			let message = input.data('original-title') || "Some explanation text here";
			alert(message);
			input.focus();
			return false;
		}

		if (input.hasClass('input_pdservice_version') && !input.val()) {
			alert("The version cannot be empty.");
			input.focus();
			return false;
		}

	}

	const startDate = new Date(startDateElement.val());
	const endDate = new Date(endDateElement.val());
	if (startDate && endDate && startDate > endDate) {
		alert("The end date must be the same or after the start date.");
		endDateElement.focus();
		return false;
	}
}

function isValidVersion(version) {
	return !!version;
}

////////////////////////////////////////////////////////////////////////////////////////
//버전 리스트를 재로드하는 함수 ( 버전 추가, 갱신, 삭제 시 호출 )
////////////////////////////////////////////////////////////////////////////////////////
function dataLoad(getSelectedText, selectedText) {
	// ajax 처리 후 에디터 바인딩.
	console.log("dataLoad :: getSelectedID → " + getSelectedText);
	$.ajax("/auth-user/api/arms/pdService/getNodeWithVersionOrderByCidDesc.do?c_id=" + getSelectedText).done(function (json) {
		console.log("dataLoad :: success → ", json);
		$("#version_accordion").jsonMenu("set", json.pdServiceVersionEntities, { speed: 5000 });
		//version text setting

		var selectedHtml =
			` 
			<div class="chat-message">
				<div    class="chat-message-body"
						style="margin-left: 0px !important; padding: 0px 10px 0px 10px !important; border-left: 2px solid #a4c6ff; border-right: 2px solid #e5603b;">
					 <span  id="toRight"
							class="arrow"
							style="top: 10px !important; right: -7px; border-top: 5px solid transparent;
							border-bottom: 5px solid transparent;
							border-left: 5px solid #e5603b;border-right: 0px; left:unset;"></span>
					<span   class="arrow"
							style="top: 10px !important; border-right: 5px solid #a4c6ff;"></span>
					<div    class="sender"
							style="padding-bottom: 5px; padding-top: 5px">
						선택된 제품(서비스) :
						<span   id="select_Service"
								style="color: #a4c6ff">
								 ` + selectedText + `
						</span>
					</div>
				</div>
			</div>`;

		$(".list-group-item").html(selectedHtml);

		$("#select_PdService").text(selectedText); // sender 이름 바인딩
		$("#pdservice_name").val(selectedText);

		$("#tooltip_enabled_service_name").val(selectedText);

		// setTimeout(function () {
		// 	$("#pdService_Version_First_Child").trigger("click");
		// }, 500);
	});
}

////////////////////////////////////////////////////////////////////////////////////////
// versionlist 이니셜라이즈
////////////////////////////////////////////////////////////////////////////////////////
function init_versionList() {
	var menu;
	$.fn.jsonMenu = function (action, items, options) {
		$(this).addClass("json-menu");
		if (action == "add") {
			menu.body.push(items);
			draw($(this), menu);
		} else if (action == "set") {
			menu = items;
			// $("#select_version").text(items[0].c_title);  // 로드시 첫번째 버전
 			draw($(this), menu);
		}
		return this;
	};
}

////////////////////////////////////////////////////////////////////////////////////////
//version list html 삽입
////////////////////////////////////////////////////////////////////////////////////////
function draw(main, menu) {
	main.html("");

	var data = `
			   <li class='list-group-item json-menu-header ch123' style="padding: 0px;">
				   <strong>product service name</strong>
			   </li>
			   <button type="button"
					class="btn btn-primary btn-block btn-sm"
					id="modal_popup_id"
					data-toggle="modal"
					data-target="#my_modal2"
					style="margin-bottom: 10px !important; margin-top: 10px;"
					onClick="modalPopup('modal_popup_id')">
					신규 버전 등록하기
				</button>
				<div class="gradient_bottom_border" style="width: 100%; height: 2px; margin-bottom: 10px;"></div>`;

	for (var i = 0; i < menu.length; i++) {
		if (i == 0) {
			data += `
			   <div class="panel">
				   <div class="panel-heading">
					   <a class="accordion-toggle collapsed"
					   			data-toggle="collapse"
					   			id="pdService_Version_First_Child"
					   			name="versionLink_List"
					   			style="color: #a4c6ff; text-decoration: none; cursor: pointer;  "
					   			onclick="versionClick(this, ${menu[i].c_id});
					   			return false;">
						   ${menu[i].c_title}
					   </a>
				   </div>
			   </div>`;
		} else {
			data += `
			   <div class="panel">
				   <div class="panel-heading">
					   <a class="accordion-toggle collapsed"
					   			data-toggle="collapse"
					   			name="versionLink_List"
					   			style="color: #a4c6ff; text-decoration: none; cursor: pointer;"
					   			onclick="versionClick(this, ${menu[i].c_id});
					   			return false;">
						   ${menu[i].c_title}
					   </a>
				   </div>
			   </div>`;
		}
	}

	main.html(data);
}

////////////////////////////////////////////////////////////////////////////////////////
//버전 클릭할 때 동작하는 함수
//1. 상세보기 데이터 바인딩
//2. 편집하기 데이터 바인딩
////////////////////////////////////////////////////////////////////////////////////////
function versionClick(element, c_id) {
	console.log("versionClick:: c_id  -> ", c_id);
	$("a[name='versionLink_List']").each(function () {
		this.style.background = "";
	});
	element.style.background = "rgba(229, 96, 59, 0.3)";
	console.log(element);

	selectVersion = c_id;

	$.ajax({
		url: "/auth-user/api/arms/pdServiceVersion/getNode.do", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
		data: { c_id: c_id }, // HTTP 요청과 함께 서버로 보낼 데이터
		method: "GET", // HTTP 요청 메소드(GET, POST 등)
		dataType: "json" // 서버에서 보내줄 데이터의 타입
	})
		// HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.
		.done(function (json) {
			console.log(" → ");
			console.log(json);

			selectVersionName = json.c_title;
			console.log(selectPdServiceName);

			$("#pdservice_name").text(selectPdServiceName);

			$("#pdservice_version").val(json.c_title);
			$("#version_start_date").val(json.c_pds_version_start_date);
			$("#version_end_date").val(json.c_pds_version_end_date);
			CKEDITOR.instances.version_contents.setData(json.c_pds_version_contents);

			$("#input_pdservice_name").val(selectPdServiceName);
			$("#input_pdservice_version").val(json.c_title);
			$("#input_pdservice_start_date").val(json.c_pds_version_start_date);
			$("#input_pdservice_end_date").val(json.c_pds_version_end_date);
			CKEDITOR.instances.input_pdservice_editor.setData(json.c_pds_version_contents);

			$("#input_pdservice_start_date").datetimepicker({ value: json.c_pds_version_start_date + " 09:00", step: 10 , theme:'dark'});
			$("#input_pdservice_end_date").datetimepicker({ value: json.c_pds_version_end_date + " 18:00", step: 10 , theme:'dark'});
			$("#btn_enabled_date").datetimepicker({ value: json.c_pds_version_start_date + " 09:00", step: 10 , theme:'dark'});
			$("#btn_end_date").datetimepicker({ value: json.c_pds_version_end_date + " 18:00", step: 10 , theme:'dark'});

			// sender 데이터 바인딩 및 선택 색상 표기
			$("#select_version").text(json.c_title);
			$("#delete_version_title").text(json.c_title);
			$(".list-item1 .chat-message-body").css({"border-left":""});
			$(".list-item1 .arrow").css({"border-right":""});

		})
		// HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.
		.fail(function (xhr, status, errorThrown) {
			console.log(xhr + status + errorThrown);
		})
		//
		.always(function (xhr, status) {
			$("#text").html("요청이 완료되었습니다!");
			console.log(xhr + status);
		});
}

function tab_click_event() {
	$('a[data-toggle="tab"]').on("shown.bs.tab", function(e) {
		var target = $(e.target).attr("href"); // activated tab
		//console.log(target);

		if (target === "#stats") {
			$("#del_version").addClass("hidden");
			$("#version_popup").removeClass("hidden");
			$("#version_update").addClass("hidden");
		}
		else if (target === "#report"){
			$("#del_version").addClass("hidden");
			$("#version_popup").removeClass("hidden");
			$("#version_update").removeClass("hidden");

		}
		else if (target === "#dropdown1"){
			$("#del_version").removeClass("hidden");
			$("#version_popup").addClass("hidden");
			$("#version_update").addClass("hidden");
		}
	});
}
