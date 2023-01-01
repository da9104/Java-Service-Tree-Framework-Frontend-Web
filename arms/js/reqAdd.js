////////////////////////////////////////////////////////////////////////////////////////
//Document Ready
////////////////////////////////////////////////////////////////////////////////////////
var selectedJsTreeId; // 요구사항 아이디
var defaultTypeDataTable;

function execArmsDocReady() {

	//좌측 메뉴
	setSideMenu(
		"sidebar_menu_requirement",
		"sidebar_menu_requirement_regist",
		"requirement-elements-collapse"
	);

	//신규 요구사항 등록 버튼 숨김
	$('.newReqDiv').hide();

	//제품(서비스) 셀렉트 박스 이니시에이터
	makePdServiceSelectBox();
	//버전 멀티 셀렉트 박스 이니시에이터
	makeVersionMultiSelectBox();

	// --- 에디터 설정 --- //
	CKEDITOR.replace("modalEditor");
	CKEDITOR.replace("editTabModalEditor");

	makeDatePicker($("#btn-start-calendar-popup"));
	makeDatePicker($("#btn-end-calendar-popup"));

};

////////////////////////////////////////////////////////////////////////////////////////
//슬림스크롤
////////////////////////////////////////////////////////////////////////////////////////
function  makeSlimScroll(targetElement) {
	$(targetElement).slimScroll({
		height: '200px',
		railVisible: true,
		railColor: '#222',
		railOpacity: 0.3,
		wheelStep: 10,
		allowPageScroll: false,
		disableFadeOut: false
	});
}


////////////////////////////////////////////////////////////////////////////////////////
//제품 서비스 셀렉트 박스
////////////////////////////////////////////////////////////////////////////////////////
function makePdServiceSelectBox(){
	//제품 서비스 셀렉트 박스 이니시에이터
	$(".chzn-select").each(function(){
		$(this).select2($(this).data());
	});

	//제품 서비스 셀렉트 박스 데이터 바인딩
	$.ajax({
		url: "/auth-user/api/arms/pdService/getPdServiceMonitor.do",
		type: "GET",
		contentType: "application/json;charset=UTF-8",
		dataType : "json",
		progress: true
	}).done(function(data) {

		for(var k in data){
			var obj = data[k];
			var newOption = new Option(obj.c_title, obj.c_id, false, false);
			$('#country').append(newOption).trigger('change');
		}
	}).fail(function(e) {
	}).always(function() {
	});

} // end makePdServiceSelectBox()

$('#country').on("select2:open", function () {
	//슬림스크롤
	makeSlimScroll(".select2-results__options");
});

// --- select2 ( 제품(서비스) 검색 및 선택 ) 이벤트 --- //
$('#country').on('select2:select', function (e) {
	// 제품( 서비스 ) 선택했으니까 자동으로 버전을 선택할 수 있게 유도
	// 디폴트는 base version 을 선택하게 하고 ( select all )

	//~> 이벤트 연계 함수 :: 요구사항 표시 jsTree 빌드
	build_ReqData_By_PdService();

	//~> 이벤트 연계 함수 :: Version 표시 jsTree 빌드
	bind_VersionData_By_PdService();
});

////////////////////////////////////////////////////////////////////////////////////////
//버전 멀티 셀렉트 박스
////////////////////////////////////////////////////////////////////////////////////////
function makeVersionMultiSelectBox(){
	//버전 선택 셀렉트 박스 이니시에이터
	$('.multiple-select').multipleSelect();
}

function bind_VersionData_By_PdService(){
	$(".multiple-select option").remove();
	$.ajax({
		url: "/auth-user/api/arms/pdServiceVersion/getVersion.do?c_id=" + $('#country').val(),
		type: "GET",
		contentType: "application/json;charset=UTF-8",
		dataType : "json",
		progress: true
	}).done(function(data) {

		for(var k in data){
			var obj = data[k];
			var $opt = $('<option />', {
				value: obj.c_id,
				text: obj.c_title,
			})

			//$('#multiVersion').append($opt);
			//$('#editMultiVersion').append($opt);
			$('.multiple-select').append($opt);
		}

		if(data.length > 0){
			console.log("display 재설정.");
		}
		//$('#multiVersion').multipleSelect('refresh');
		//$('#editMultiVersion').multipleSelect('refresh');
		$('.multiple-select').multipleSelect('refresh');

	}).fail(function(e) {
	}).always(function() {
	});
}

////////////////////////////////////////////////////////////////////////////////////////
//요구사항 :: jsTree
////////////////////////////////////////////////////////////////////////////////////////
function build_ReqData_By_PdService(){
	jsTreeBuild("#productTree", "reqAdd/T_ARMS_REQADD_" + $('#country').val());
}

// --- 요구사항 (jstree) 선택 이벤트 --- //
function jsTreeClick(selectedNodeID) {
	selectedJsTreeId = selectedNodeID.attr("id").replace("node_", "").replace("copy_", "");
	var selectRel = selectedNodeID.attr("rel");
	
	//요구사항 타입에 따라서 탭의 설정을 변경
	if(selectRel == "default"){
		$('#defaultTab').get(0).click();
		$('.newReqDiv').hide();
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(1)').show(); //상세보기
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(2)').show(); //편집하기
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(3)').hide(); //리스트보기
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(4)').hide(); //문서로보기
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(5)').show(); //JIRA연결설정

		//상세보기 탭 셋팅
		setDetailAndEditViewTab();

		defaultTypeDataTable = defaultType_dataTableLoad(selectedJsTreeId);

	}else{
		$('#folderTab').get(0).click();
		$('.newReqDiv').show();
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(1)').show(); //상세보기
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(2)').show(); //편집하기
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(3)').show(); //리스트보기
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(4)').show(); //문서로보기
		$('.widget-tabs').children('header').children('ul').children('li:nth-child(5)').hide(); //JIRA연결설정

		// 리스트로 보기(DataTable) 설정 ( 폴더나 루트니까 )
		// 상세보기 탭 셋팅이 데이터테이블 렌더링 이후 시퀀스 호출 함.
		dataTableLoad(selectedJsTreeId);

	}

	//파일 데이터셋팅
	get_FileList_By_Req();
}

////////////////////////////////////////////////////////////////////////////////////////
//리스트 :: DataTable
////////////////////////////////////////////////////////////////////////////////////////
// --- Root, Drive, Folder 데이터 테이블 설정 --- //
function dataTableLoad(selectId) {
	// 데이터 테이블 컬럼 및 열그룹 구성
	var columnList = [
		{ data: "c_id" },
		{ data: "c_left" },
		{ data: "c_title" },
	];
	var rowsGroupList = [];
	var tableName = "T_ARMS_REQADD_" + $('#country').val();

	var dataTableRef;
	if(selectId == 2){
		dataTableRef = dataTableBuild("#reqTable", "reqAdd/" + tableName, "/getMonitor.do", columnList, rowsGroupList);
	}else{

		//select node 정보를 가져온다.
		$.ajax({
			url: "/auth-user/api/arms/reqAdd/" + tableName + "/getNode.do?c_id=" + selectId,
			type: "GET",
			contentType: "application/json;charset=UTF-8",
			dataType : "json",
			progress: true,
			success: function(data) {
				var paramUrl = "c_id=313&c_left=" + data.c_left + "&c_right=" + data.c_right;
				dataTableRef = dataTableBuild("#reqTable", "reqAdd/" + tableName, "/getChildNodeWithParent.do?"+paramUrl, columnList, rowsGroupList);
			}
		}).done(function(data) {
		}).fail(function(e) {
		}).always(function() {
		});

	}

	// ----- 데이터 테이블 빌드 이후 별도 스타일 구성 ------ //
	//datatable 좌상단 datarow combobox style
	$("body").find("[aria-controls='pdserviceTable']").css("width", "100px");
	$("select[name=pdserviceTable_length]").css("width", "50px");
}

// --- default 데이터 테이블 설정 --- //
// -------------------- checkbox 가 들어가야 하는 데이터테이블 이므로 row code를 사용함 ------------------ //
// -------------------- 데이터 테이블을 만드는 템플릿으로 쓰기에 적당하게 리팩토링 함. ------------------ //
function defaultType_dataTableLoad(selectId) {

	var jQueryElementID = "#jiraVerTable";
	var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	var jQueryElementStr = jQueryElementID.replace(reg,'');
	console.log("jQueryElementStr ======== " + jQueryElementStr );
	var serviceNameForURL = "pdServiceJiraVer";
	var endPointUrl = "/getMonitor_Without_Root.do";
	// 데이터 테이블 컬럼 및 열그룹 구성
	var columnList = [
		{
			data:   "c_id",
			render: function ( data, type, row ) {
				if ( type === 'display' ) {
					return '<input type="checkbox" class="editor-active" name="jiraVerList" value="' + data + '">';
				}
				return data;
			},
			className: "dt-body-center"
		},
		{ data: "c_pdservice_name" },
		{ data: "c_pdservice_version_name" },
		{ data: "c_pdservice_jira_name"}
	];
	var rowsGroupList = [];
	var columnDefList = [
		{
			orderable: false,
			className: 'select-checkbox',
			targets: 0
		}
	];
	var selectList = {
		style:    'os',
		selector: 'td:first-child'
	};
	var orderList = [[ 1, 'asc' ]];
	console.log("defaultType_dataTableLoad selectId -> " + selectId);
	console.log("dataTableBuild :: jQueryElementID -> " + jQueryElementID + ", serviceNameForURL -> " + serviceNameForURL);
	console.log("dataTableBuild :: columnList -> " + columnList + ", rowsGroupList -> " + rowsGroupList);

	console.log("dataTableBuild :: href: " + $(location).attr("href"));
	console.log("dataTableBuild :: protocol: " + $(location).attr("protocol"));
	console.log("dataTableBuild :: host: " + $(location).attr("host"));
	console.log("dataTableBuild :: pathname: " + $(location).attr("pathname"));
	console.log("dataTableBuild :: search: " + $(location).attr("search"));
	console.log("dataTableBuild :: hostname: " + $(location).attr("hostname"));
	console.log("dataTableBuild :: port: " + $(location).attr("port"));

	var authCheckURL = "/auth-user";

	var tempDataTable = $(jQueryElementID).DataTable({
		ajax: {
			url: authCheckURL + "/api/arms/" + serviceNameForURL + endPointUrl,
			dataSrc: ''
		},
		destroy: true,
		processing: true,
		responsive: true,
		columns: columnList,
		rowsGroup: rowsGroupList,
		columnDefs: columnDefList,
		select: selectList,
		order: orderList,
		drawCallback: function() {
			console.log("dataTableBuild :: drawCallback");
			if ($.isFunction(dataTableCallBack )) {
				dataTableCallBack();
			}
		}
	});

	$(jQueryElementID + " tbody").on("click", "tr", function () {

		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected");
		} else {
			tempDataTable.$("tr.selected").removeClass("selected");
			$(this).addClass("selected");
		}

		var selectedData = tempDataTable.row(this).data();
		selectedData.selectedIndex = $(this).closest('tr').index();

		var info = tempDataTable.page.info();
		console.log( 'Showing page: '+info.page+' of '+info.pages );
		selectedData.selectedPage = info.page;

		dataTableClick(selectedData);
	});

	// ----- 데이터 테이블 빌드 이후 스타일 구성 ------ //
	//datatable 좌상단 datarow combobox style
	$(".dataTables_length").find("select:eq(0)").addClass("darkBack");
	$(".dataTables_length").find("select:eq(0)").css("min-height", "30px");
	//min-height: 30px;

	// ----- 데이터 테이블 빌드 이후 별도 스타일 구성 ------ //
	//datatable 좌상단 datarow combobox style
	$("body").find("[aria-controls='" + jQueryElementStr + "']").css("width", "100px");
	$("select[name=" + jQueryElementStr + "]").css("width", "50px");

	return tempDataTable;
}
// -------------------- 데이터 테이블을 만드는 템플릿으로 쓰기에 적당하게 리팩토링 함. ------------------ //

// 데이터 테이블 구성 이후 꼭 구현해야 할 메소드 : 열 클릭시 이벤트
function dataTableClick(selectedData) {
	console.log(selectedData);
}

// 데이터 테이블 데이터 렌더링 이후 콜백 함수.
function dataTableCallBack(){
	setDocViewTab();
	//상세보기 탭 셋팅
	setDetailAndEditViewTab();
}
////////////////////////////////////////////////////////////////////////////////////////
//파일 관리 : fileupload
////////////////////////////////////////////////////////////////////////////////////////
/** file upload 이니시에이터 **/
$(function () {
	'use strict';

	// Initialize the jQuery File Upload widget:
	var $fileupload = $('#fileupload');
	$fileupload.fileupload({
		// Uncomment the following to send cross-domain cookies:
		//xhrFields: {withCredentials: true},
		autoUpload: true,
		url: '/auth-user/api/arms/reqAdd/uploadFileToNode.do',
		dropZone: $('#dropzone')
	});

	// Enable iframe cross-domain access via redirect option:
	$fileupload.fileupload(
		'option',
		'redirect',
		window.location.href.replace(
			/\/[^\/]*$/,
			'/cors/result.html?%s'
		)
	);

	// Load existing files:
	$.ajax({
		// Uncomment the following to send cross-domain cookies:
		//xhrFields: {withCredentials: true},
		url: $fileupload.fileupload('option', 'url'),
		dataType: 'json',
		context: $fileupload[0]
	}).done(function (result) {
		$(this).fileupload('option', 'done').call(this, null, { result: result });
	});

});

$('#fileupload').bind('fileuploadsubmit', function (e, data) {
	// The example input, doesn't have to be part of the upload form:
	var input = $('#fileIdLink');
	var tableName = "T_ARMS_REQADD_" + $('#country').val();
	data.formData = { fileIdLink: input.val(), c_title: tableName };
	if (!data.formData.fileIdLink) {
		data.context.find('button').prop('disabled', false);
		input.focus();
		return false;
	}
});

function get_FileList_By_Req() {
	$('#fileIdLink').val(selectedJsTreeId);
	//jstree click 시 file 컨트롤
	//파일 리스트 초기화
	$("table tbody.files").empty();
	// Load existing files:
	var $fileupload = $('#fileupload');
	// Load existing files:
	$.ajax({
		// Uncomment the following to send cross-domain cookies:
		//xhrFields: {withCredentials: true},
		url: '/auth-user/api/arms/fileRepository/getFilesByNode.do',
		data: { fileIdLink: selectedJsTreeId, c_title: "T_ARMS_REQADD_" + $('#country').val() },
		dataType: 'json',
		context: $fileupload[0]
	}).done(function (result) {
		$(this).fileupload('option', 'done').call(this, null, { result: result });
	});
}

////////////////////////////////////////////////////////////////////////////////////////
//상세 보기 탭 & 편집 탭
////////////////////////////////////////////////////////////////////////////////////////
function setDetailAndEditViewTab(){
	var tableName = "T_ARMS_REQADD_" + $('#country').val();
	$.ajax({
		url: "/auth-user/api/arms/reqAdd/" + tableName + "/getNode.do?c_id=" + selectedJsTreeId,
		type: "GET",
		contentType: "application/json;charset=UTF-8",
		dataType : "json",
		progress: true
	}).done(function(data) {

		// ------------------ 편집하기 ------------------ //
		bindDataEditlTab(data);
		// ------------------ 상세보기 ------------------ //
		bindDataDetailTab(data);

	}).fail(function(e) {
	}).always(function() {
	});
}

// ------------------ 편집하기 ------------------ //
function bindDataEditlTab(ajaxData){

	//제품(서비스) 데이터 바인딩
	var selectedPdServiceText = $('#country').select2('data')[0].text;
	if(isEmpty(selectedPdServiceText)){
		$('#editView-req-pdService-name').val("");
	}else{
		$('#editView-req-pdService-name').val(selectedPdServiceText);
	}

	// 버전 데이터 바인딩
	if(!isEmpty(ajaxData.c_version_link)) {
		$('#editMultiVersion').multipleSelect('setSelects', ajaxData.c_version_link.split(","));
	}else{
		$('#editMultiVersion').multipleSelect('uncheckAll');
	}

	$('#editView-req-id').val(ajaxData.c_id);
	$('#editView-req-name').val(ajaxData.c_title);

	$('#editView-req-priority').children('.btn.active').removeClass("active");
	var slectReqPriorityID = "editView-req-priority-option" + ajaxData.c_priority;
	$('#'+slectReqPriorityID).parent().addClass("active");

	// -------------------- reviewer setting -------------------- //
	//reviewer clear
	$('#editView-req-reviewers').val(null).trigger('change');

	var selectedReviewerArr = [];
	if (ajaxData.c_reviewer01 == null || ajaxData.c_reviewer01 == "none") {
		console.log("bindDataEditlTab :: ajaxData.c_reviewer01 empty");
	} else {

		selectedReviewerArr.push(ajaxData.c_reviewer01);
		// Set the value, creating a new option if necessary
		if ($('#editView-req-reviewers').find("option[value='" + ajaxData.c_reviewer01 + "']").length) {
			console.log("option[value='\" + ajaxData.c_reviewer01 + \"']\"" + "already exist");
		} else {
			// Create a DOM Option and pre-select by default
			var newOption01 = new Option(ajaxData.c_reviewer01, ajaxData.c_reviewer01, true, true);
			// Append it to the select
			$('#editView-req-reviewers').append(newOption01).trigger('change');
		}

	}
	if (ajaxData.c_reviewer02 == null || ajaxData.c_reviewer02 == "none") {
		console.log("bindDataEditlTab :: ajaxData.c_reviewer02 empty");
	} else {

		selectedReviewerArr.push(ajaxData.c_reviewer02);
		// Set the value, creating a new option if necessary
		if ($('#editView-req-reviewers').find("option[value='" + ajaxData.c_reviewer02 + "']").length) {
			console.log("option[value='\" + ajaxData.c_reviewer02 + \"']\"" + "already exist");
		} else {
			// Create a DOM Option and pre-select by default
			var newOption02 = new Option(ajaxData.c_reviewer02, ajaxData.c_reviewer02, true, true);
			// Append it to the select
			$('#editView-req-reviewers').append(newOption02).trigger('change');
		}

	}
	if (ajaxData.c_reviewer03 == null || ajaxData.c_reviewer03 == "none") {
		console.log("bindDataEditlTab :: ajaxData.c_reviewer03 empty");
	} else {

		selectedReviewerArr.push(ajaxData.c_reviewer03);
		// Set the value, creating a new option if necessary
		if ($('#editView-req-reviewers').find("option[value='" + ajaxData.c_reviewer03 + "']").length) {
			console.log("option[value='\" + ajaxData.c_reviewer03 + \"']\"" + "already exist");
		} else {
			// Create a DOM Option and pre-select by default
			var newOption03 = new Option(ajaxData.c_reviewer03, ajaxData.c_reviewer03, true, true);
			// Append it to the select
			$('#editView-req-reviewers').append(newOption03).trigger('change');
		}

	}
	if (ajaxData.c_reviewer04 == null || ajaxData.c_reviewer04 == "none") {
		console.log("bindDataEditlTab :: ajaxData.c_reviewer04 empty");
	} else {

		selectedReviewerArr.push(ajaxData.c_reviewer04);
		// Set the value, creating a new option if necessary
		if ($('#editView-req-reviewers').find("option[value='" + ajaxData.c_reviewer04 + "']").length) {
			console.log("option[value='\" + ajaxData.c_reviewer04 + \"']\"" + "already exist");
		} else {
			// Create a DOM Option and pre-select by default
			var newOption04 = new Option(ajaxData.c_reviewer04, ajaxData.c_reviewer04, true, true);
			// Append it to the select
			$('#editView-req-reviewers').append(newOption04).trigger('change');
		}

	}
	if (ajaxData.c_reviewer05 == null || ajaxData.c_reviewer05 == "none") {
		console.log("bindDataEditlTab :: ajaxData.c_reviewer05 empty");
	} else {

		selectedReviewerArr.push(ajaxData.c_reviewer05);
		// Set the value, creating a new option if necessary
		if ($('#editView-req-reviewers').find("option[value='" + ajaxData.c_reviewer05 + "']").length) {
			console.log("option[value='\" + ajaxData.c_reviewer05 + \"']\"" + "already exist");
		} else {
			// Create a DOM Option and pre-select by default
			var newOption05 = new Option(ajaxData.c_reviewer05, ajaxData.c_reviewer05, true, true);
			// Append it to the select
			$('#editView-req-reviewers').append(newOption05).trigger('change');
		}

	}
	$('#editView-req-reviewers').val(selectedReviewerArr).trigger('change');

	// ------------------------- reviewer end --------------------------------//
	$('#editView-req-status').val(ajaxData.c_req_status);
	$('#editView-req-writer').val(ajaxData.c_writer);
	$('#editView-req-write-date').val(ajaxData.c_writer_date);
	CKEDITOR.instances.editTabModalEditor.setData(ajaxData.c_contents);
}

// ------------------ 상세보기 ------------------ //
function bindDataDetailTab(ajaxData){

	//제품(서비스) 데이터 바인딩
	var selectedPdServiceText = $('#country').select2('data')[0].text;
	if(isEmpty(selectedPdServiceText)){
		$('#detailView-req-pdService-name').text("");
	}else{
		$('#detailView-req-pdService-name').text(selectedPdServiceText);
	}

	//Version 데이터 바인딩
	var selectedVersionText = $('#editMultiVersion').multipleSelect('getSelects', 'text');
	if ( isEmpty(selectedVersionText)){
		$('#detailView-req-pdService-version').text("요구사항에 등록된 버전이 없습니다.");
	}else {
		$('#detailView-req-pdService-version').text(selectedVersionText);
	}
	$('#detailView-req-id').text(ajaxData.c_id);
	$('#detailView-req-name').text(ajaxData.c_title);

	//우선순위 셋팅
	$('#detailView-req-priority').children('.btn.active').removeClass("active");
	var slectReqPriorityID = "detailView-req-priority-option" + ajaxData.c_priority;
	$('#'+slectReqPriorityID).parent().addClass("active");

	$('#detailView-req-status').text(ajaxData.c_req_status);
	$('#detailView-req-writer').text(ajaxData.c_writer);
	$('#detailView-req-write-date').text(ajaxData.c_writer_date);

	if (ajaxData.c_reviewer01 == null || ajaxData.c_reviewer01 == "none") {
		$("#detailView-req-reviewer01").text("리뷰어(연대책임자)가 존재하지 않습니다.");
	} else {
		$("#detailView-req-reviewer01").text(ajaxData.c_reviewer01);
	}
	if (ajaxData.c_reviewer02 == null || ajaxData.c_reviewer02 == "none") {
		$("#detailView-req-reviewer02").text("");
	} else {
		$("#detailView-req-reviewer02").text(ajaxData.c_reviewer02);
	}
	if (ajaxData.c_reviewer03 == null || ajaxData.c_reviewer03 == "none") {
		$("#detailView-req-reviewer03").text("");
	} else {
		$("#detailView-req-reviewer03").text(ajaxData.c_reviewer03);
	}
	if (ajaxData.c_reviewer04 == null || ajaxData.c_reviewer04 == "none") {
		$("#detailView-req-reviewer04").text("");
	} else {
		$("#detailView-req-reviewer04").text(ajaxData.c_reviewer04);
	}
	if (ajaxData.c_reviewer05 == null || ajaxData.c_reviewer05 == "none") {
		$("#detailView-req-reviewer05").text("");
	} else {
		$("#detailView-req-reviewer05").text(ajaxData.c_reviewer05);
	}
	$("#detailView-req-contents").html(ajaxData.c_contents);
}


///////////////////////////////////////////////////////////////////////////////
//문서로 보기 탭
///////////////////////////////////////////////////////////////////////////////
function setDocViewTab(){
	$('.dd-list').empty();
	var data = $('#reqTable').DataTable().rows().data().toArray();

	var firstBranchChecker = true;
	$.each( data, function( key, value ) {

		if(value.c_contents == null || value.c_contents == "null"){
			value.c_contents = "";
		}

		console.log(value.c_id + "=" + value.c_type + "=" + value.c_title + "//" + value.c_parentid);

		var iconHtml;
		if(value.c_type == "root" || value.c_type == "drive"){
			iconHtml = "<i class='fa fa-clipboard'></i>";
		}else if(value.c_type == "folder"){
			iconHtml = "<i class='fa fa-files-o'></i>";
		}else {
			iconHtml = "<i class='fa fa-file-text-o'></i>";
		}

		if(value.c_type == "root"){
			console.log("ROOT 노드는 처리하지 않습니다.");
		}else if(value.c_type == "drive" || value.c_type == "folder"){
			if(firstBranchChecker){
				$('.dd-list').append("<li class='dd-item' id='" + "T_ARMS_REQ_" + value.c_id + "' data-id='" + value.c_id + "'>" +
					"<div class='dd-handle'>" +
					iconHtml +
					" " + value.c_title +
					"<p>" + value.c_contents + "</p>" +
					"</div>" +
					"</li>");
				firstBranchChecker = false;
			}else{
				$('#T_ARMS_REQ_'+value.c_parentid).append("<ol class='dd-list'>" +
					"<li class='dd-item' id='" + "T_ARMS_REQ_" + value.c_id +"' data-id='" + value.c_id + "'>" +
					"<div class='dd-handle'>" +
					iconHtml +
					" " + value.c_title +
					"<p>" + value.c_contents + "</p>" +
					"</div>" +
					"</li>" +
					"</ol>");
			}
		}else {
			$('#T_ARMS_REQ_'+value.c_parentid).append("<ol class='dd-list'>" +
				"<li class='dd-item' id='" + "T_ARMS_REQ_" + value.c_id +"' data-id='" + value.c_id + "'>" +
				"<div class='dd-handle'>" +
				iconHtml +
				" " + value.c_title +
				"<p>" + value.c_contents + "</p>" +
				"</div>" +
				"</li>" +
				"</ol>");
		}

	});
	//console.log(data);
}

///////////////////////////////////////////////////////////////////////////////
// --- select2 (사용자 자동완성 검색 ) 설정 --- //
///////////////////////////////////////////////////////////////////////////////
$(".js-data-example-ajax").select2({
	maximumSelectionLength: 5,
	width: 'resolve',
	ajax: {
		url: function (params) {
			return '/auth-check/getUsers/' + params.term;
		},
		dataType: "json",
		delay: 250,
		//data: function (params) {
		//    return {
		//        q: params.term, // search term
		//        page: params.page,
		//    };
		//},
		processResults: function (data, params) {
			// parse the results into the format expected by Select2
			// since we are using custom formatting functions we do not need to
			// alter the remote JSON data, except to indicate that infinite
			// scrolling can be used
			params.page = params.page || 1;

			return {
				results: data,
				pagination: {
					more: params.page * 30 < data.total_count,
				},
			};
		},
		cache: true,
	},
	placeholder: "리뷰어 설정을 위한 계정명을 입력해 주세요",
	minimumInputLength: 1,
	templateResult: formatUser,
	templateSelection: formatUserSelection,
});

// --- select2 (사용자 자동완성 검색 ) templateResult 설정 --- //
function formatUser(jsonData) {
	var $container = $(
		"<div class='select2-result-jsonData clearfix'>" +
		"<div class='select2-result-jsonData__meta'>" +
		"<div class='select2-result-jsonData__username'><i class='fa fa-flash'></i></div>" +
		"<div class='select2-result-jsonData__id'><i class='fa fa-star'></i></div>" +
		"</div>" +
		"</div>"
	);

	$container.find(".select2-result-jsonData__username").text(jsonData.username);
	$container
		.find(".select2-result-jsonData__id")
		.text(jsonData.id);

	return $container;
}

// --- select2 (사용자 자동완성 검색 ) templateSelection 설정 --- //
function formatUserSelection(jsonData) {

	if (jsonData.id == '') {
		jsonData.text = "placeholder";
	} else {

		if (jsonData.username == undefined) {
			jsonData.text = jsonData.id;
		} else {
			jsonData.text = "[" + jsonData.username + "] - " + jsonData.id;
		}

	}
	return jsonData.text;
}

// --- select2 (사용자 자동완성 검색 ) 선택하고 나면 선택된 데이터 공간을 벌리기위한 설정 --- //
$('#editView-req-reviewers').on('select2:select', function (e) {
	console.log("select2:select");
});


///////////////////////////////////////////////////////////////////////////////
// 신규 요구사항 팝업 데이터 셋팅
///////////////////////////////////////////////////////////////////////////////
$("#newReqRegist01").click(function () {
	registNewPopup();
});
$("#newReqRegist02").click(function () {
	registNewPopup();
});
$("#newReqRegist03").click(function () {
	registNewPopup();
});

function registNewPopup(){

	var height = $(document).height() - 700;
	$(".modal-body")
		.find(".cke_contents:eq(0)")
		.css("height", height + "px");

	//제품(서비스) 셋팅
	var selectPdService = $('#country').select2('data')[0].text;
	$('#disabled-input-pdservice').val(selectPdService);

	//version 셋팅
	var selectedVersion = $('#multiVersion').val();
	$('#popup-version').multipleSelect('setSelects', selectedVersion);

	//리뷰어 셋팅
	$.ajax({
		url: "/auth-user/api/arms/pdService/getNode.do?c_id=" + $('#country').val(),
		type: "GET",
		contentType: "application/json;charset=UTF-8",
		dataType : "json",
		progress: true
	}).done(function(data) {

		// -------------------- reviewer setting -------------------- //
		//reviewer clear
		$('#popup-pdService-reviewers').val(null).trigger('change');

		var selectedReviewerArr = [];
		if (data.c_reviewer01 == null || data.c_reviewer01 == "none") {
			console.log("registNewPopup :: data.c_reviewer01 empty");
		} else {

			selectedReviewerArr.push(data.c_reviewer01);
			// Set the value, creating a new option if necessary
			if ($('#popup-pdService-reviewers').find("option[value='" + data.c_reviewer01 + "']").length) {
				console.log("option[value='\" + data.c_reviewer01 + \"']\"" + "already exist");
			} else {
				// Create a DOM Option and pre-select by default
				var newOption01 = new Option(data.c_reviewer01, data.c_reviewer01, true, true);
				// Append it to the select
				$('#popup-pdService-reviewers').append(newOption01).trigger('change');
			}

		}
		if (data.c_reviewer02 == null || data.c_reviewer02 == "none") {
			console.log("registNewPopup :: data.c_reviewer02 empty");
		} else {

			selectedReviewerArr.push(data.c_reviewer02);
			// Set the value, creating a new option if necessary
			if ($('#popup-pdService-reviewers').find("option[value='" + data.c_reviewer02 + "']").length) {
				console.log("option[value='\" + data.c_reviewer02 + \"']\"" + "already exist");
			} else {
				// Create a DOM Option and pre-select by default
				var newOption02 = new Option(data.c_reviewer02, data.c_reviewer02, true, true);
				// Append it to the select
				$('#popup-pdService-reviewers').append(newOption02).trigger('change');
			}

		}
		if (data.c_reviewer03 == null || data.c_reviewer03 == "none") {
			console.log("registNewPopup :: data.c_reviewer03 empty");
		} else {

			selectedReviewerArr.push(data.c_reviewer03);
			// Set the value, creating a new option if necessary
			if ($('#popup-pdService-reviewers').find("option[value='" + data.c_reviewer03 + "']").length) {
				console.log("option[value='\" + data.c_reviewer03 + \"']\"" + "already exist");
			} else {
				// Create a DOM Option and pre-select by default
				var newOption03 = new Option(data.c_reviewer03, data.c_reviewer03, true, true);
				// Append it to the select
				$('#popup-pdService-reviewers').append(newOption03).trigger('change');
			}

		}
		if (data.c_reviewer04 == null || data.c_reviewer04 == "none") {
			console.log("registNewPopup :: data.c_reviewer04 empty");
		} else {

			selectedReviewerArr.push(data.c_reviewer04);
			// Set the value, creating a new option if necessary
			if ($('#popup-pdService-reviewers').find("option[value='" + data.c_reviewer04 + "']").length) {
				console.log("option[value='\" + data.c_reviewer04 + \"']\"" + "already exist");
			} else {
				// Create a DOM Option and pre-select by default
				var newOption04 = new Option(data.c_reviewer04, data.c_reviewer04, true, true);
				// Append it to the select
				$('#popup-pdService-reviewers').append(newOption04).trigger('change');
			}

		}
		if (data.c_reviewer05 == null || data.c_reviewer05 == "none") {
			console.log("registNewPopup :: data.c_reviewer05 empty");
		} else {

			selectedReviewerArr.push(data.c_reviewer05);
			// Set the value, creating a new option if necessary
			if ($('#popup-pdService-reviewers').find("option[value='" + data.c_reviewer05 + "']").length) {
				console.log("option[value='\" + data.c_reviewer05 + \"']\"" + "already exist");
			} else {
				// Create a DOM Option and pre-select by default
				var newOption05 = new Option(data.c_reviewer05, data.c_reviewer05, true, true);
				// Append it to the select
				$('#popup-pdService-reviewers').append(newOption05).trigger('change');
			}

		}
		$('#popup-pdService-reviewers').val(selectedReviewerArr).trigger('change');

		// ------------------------- reviewer end --------------------------------//

	});

}

///////////////////////////////////////////////////////////////////////////////
// 팝업에서 등록 모드에 따라서, 정보를 보여주거나 감추는 역할
///////////////////////////////////////////////////////////////////////////////
$('.form-horizontal input[name=reqType]').on('change', function() {

	if ( $('input[name=reqType]:checked').val() == "default" ){

		$('#popupVersionDiv').show();
		$('#popupReviewerDiv').show();
		$('#popupPriorityDiv').show();

	}else{

		$('#popupVersionDiv').hide();
		$('#popupReviewerDiv').hide();
		$('#popupPriorityDiv').hide();

	}

});


///////////////////////////////////////////////////////////////////////////////
// 팝업에서 신규 요구사항 저장 버튼
///////////////////////////////////////////////////////////////////////////////
$("#save-req").click(function () {

	var reviewers01 = "none";
	var reviewers02 = "none";
	var reviewers03 = "none";
	var reviewers04 = "none";
	var reviewers05 = "none";
	if ($('#popup-pdService-reviewers').select2('data')[0] != undefined) {
		reviewers01 = $('#popup-pdService-reviewers').select2('data')[0].text;
	}
	if ($('#popup-pdService-reviewers').select2('data')[1] != undefined) {
		reviewers02 = $('#popup-pdService-reviewers').select2('data')[1].text;
	}
	if ($('#popup-pdService-reviewers').select2('data')[2] != undefined) {
		reviewers03 = $('#popup-pdService-reviewers').select2('data')[2].text;
	}
	if ($('#popup-pdService-reviewers').select2('data')[3] != undefined) {
		reviewers04 = $('#popup-pdService-reviewers').select2('data')[3].text;
	}
	if ($('#popup-pdService-reviewers').select2('data')[4] != undefined) {
		reviewers05 = $('#popup-pdService-reviewers').select2('data')[4].text;
	}

	var tableName = "T_ARMS_REQADD_" + $('#country').val();

	$.ajax({
		url: "/auth-user/api/arms/reqAdd/" + tableName + "/addNode.do",
		type: "POST",
		data: {
			ref: selectedJsTreeId,
			c_title: $("#req-title").val(),
			c_type: $('input[name=reqType]:checked').val(),
			c_pdservice_link: $('#country').val(),
			c_version_link: JSON.stringify($('#popup-version').val()),
			c_jira_link: "inherit",
			c_writer: "["+userName+"]" + " - " + userID,
			c_writer_date: new Date(),
			c_priority: 2,
			c_reviewer01: reviewers01,
			c_reviewer02: reviewers02,
			c_reviewer03: reviewers03,
			c_reviewer04: reviewers04,
			c_reviewer05: reviewers05,
			c_req_status: "Draft",
			c_contents: CKEDITOR.instances["modalEditor"].getData(),
		},
		statusCode: {
			200: function () {
				$('#productTree').jstree('refresh');
				$('#close-req').trigger('click');
				jSuccess($("#popup-pdService-name").val() + "의 데이터가 변경되었습니다.");
			},
		},
	});
});



///////////////////////////////////////////////////////////////////////////////
// 요구사항 편집 탭 저장 버튼
///////////////////////////////////////////////////////////////////////////////
$("#editTab_Req_Update").click(function () {

	var tableName = "T_ARMS_REQADD_" + $('#country').val();
	var reqName = $('#editView-req-name').val();

	var reviewers01 = "none";
	var reviewers02 = "none";
	var reviewers03 = "none";
	var reviewers04 = "none";
	var reviewers05 = "none";
	if ($('#editView-req-reviewers').select2('data')[0] != undefined) {
		reviewers01 = $('#editView-req-reviewers').select2('data')[0].text;
	}
	if ($('#editView-req-reviewers').select2('data')[1] != undefined) {
		reviewers02 = $('#editView-req-reviewers').select2('data')[1].text;
	}
	if ($('#editView-req-reviewers').select2('data')[2] != undefined) {
		reviewers03 = $('#editView-req-reviewers').select2('data')[2].text;
	}
	if ($('#editView-req-reviewers').select2('data')[3] != undefined) {
		reviewers04 = $('#editView-req-reviewers').select2('data')[3].text;
	}
	if ($('#editView-req-reviewers').select2('data')[4] != undefined) {
		reviewers05 = $('#editView-req-reviewers').select2('data')[4].text;
	}

	//우선 순위 값 셋팅
	var priorityValue = $('#editView-req-priority').children('.btn.active').children('input').attr('id');
	priorityValue = priorityValue.replace("editView-req-priority-option","");

	$.ajax({
		url: "/auth-user/api/arms/reqAdd/" + tableName + "/updateNode.do",
		type: "POST",
		data: {
			c_id: $('#editView-req-id').val(),
			c_title: $('#editView-req-name').val(),
			c_version_link: JSON.stringify($('#editMultiVersion').val()),
			c_writer: "admin",
			c_writer_date: new Date(),
			c_priority: priorityValue,
			c_reviewer01: reviewers01,
			c_reviewer02: reviewers02,
			c_reviewer03: reviewers03,
			c_reviewer04: reviewers04,
			c_reviewer05: reviewers05,
			c_req_status: "ChangeReq",
			c_contents: CKEDITOR.instances["editTabModalEditor"].getData(),
		},
		statusCode: {
			200: function () {
				$('#productTree').jstree('refresh');
				jSuccess(reqName + "의 데이터가 변경되었습니다.");
			},
		},
	});
});


///////////////////////////////////////////////////////////////////////////////
// 달력
///////////////////////////////////////////////////////////////////////////////
function makeDatePicker (calender) {
	var Inputs = $(calender).parent().prev().val();
	$(calender).attr('data-date', Inputs)

	calender
		.datepicker({
			autoclose: true,
		})
		.datepicker("update", Inputs)
		.on("changeDate", function (ev) {

			var Input = $(this).parent().next();
			Input.val(calender.data("date"));
			calender.datepicker("hide");
		});
};

///////////////////////////////////////////////////////////////////////////////
// History TAB 검색 버튼
///////////////////////////////////////////////////////////////////////////////
$("#logSearch").click(function () {

	$('.timeline-item-body').remove();
	var tableName = "T_ARMS_REQADD_" + $('#country').val();

	$.ajax({
		url: "/auth-user/api/arms/reqAdd/" + tableName + "/getHistory.do",
		type: "GET",
		data: {
			startDate: $("#input_req_start_date").val(),
			endDate: $("#input_req_end_date").val()
		},
		contentType: "application/json;charset=UTF-8",
		dataType : "json",
		progress: true,
		statusCode: {
			200: function () {
				console.log("성공!");
				jSuccess("데이터 조회가 완료되었습니다.");
			},
		},
	}).done(function(data) {

		for(var k in data){
			var obj = data[k];

			console.log("jsonIndex[" + k +"]=" + "obj.fileIdLink => " + obj.fileIdLink); //t_arms_filerepository
			console.log("jsonIndex[" + k +"]=" + "obj.c_pdservice_jira_ids => " + obj.c_pdservice_jira_ids); //t_arms_pdserviceconnect
			console.log("jsonIndex[" + k +"]=" + "obj.c_jira_con_passmode => " + obj.c_jira_con_passmode); //t_arms_pdservicjira
			console.log("jsonIndex[" + k +"]=" + "obj.c_end_date => " + obj.c_end_date); //t_arms_pdservicversion
			console.log("jsonIndex[" + k +"]=" + "obj.c_fileid_link => " + obj.c_fileid_link); //t_arms_pdservice
			console.log("jsonIndex[" + k +"]=" + "obj.c_req_status => " + obj.c_req_status); //t_arms_reqadd

			if(!isEmpty(obj.fileIdLink) && isEmpty(obj.c_pdservice_jira_ids) && isEmpty(obj.c_jira_con_passmode) && isEmpty(obj.c_end_date) && isEmpty(obj.c_fileid_link) && isEmpty(obj.c_req_status)){
				//t_arms_filerepository
				if(obj.c_title=="pdService"){

				}else{
					var timestamp_t_arms_filerepository = new Date(obj.c_date);
					var datetime_t_arms_filerepository = timestamp_t_arms_filerepository.getFullYear()+"/"+(timestamp_t_arms_filerepository.getMonth()+1)+"/"+timestamp_t_arms_filerepository.getDate()+
						" "+timestamp_t_arms_filerepository.getHours()+":"+timestamp_t_arms_filerepository.getMinutes();

					var add_t_arms_filerepository =
						"<li class=\"timeline-item-body\">\n" +
						"	<i class=\"fa fa-check-square-o bg-maroon\"></i>\n" +
						"	<div class=\"timeline-item\">\n" +
						"		<span class=\"arrow\"></span>\n" +
						"		<span class=\"time\"><i class=\"fa fa-clock-o\"></i>" + datetime_t_arms_filerepository + "</span>\n" +
						"		<h3 class=\"timeline-header\"><a href=\"#\">기획</a> <small class=\"font11\">요구사항 파일 로그</small></h3>\n" +
						"		<div class=\"timeline-body col-md-4 font11\">\n" +
						"			<a href=\"#\" target=\"_blank\" class=\"btn bg-maroon btn-xs\" style=\"font-size: 11px;\"><i class=\"fa fa-share\"></i> 로그 자세히 보기</a>\n" +
						"		</div>\n" +
						" <div class=\"timeline-footer col-md-8 font12 fontw600\">\n" +
						"  저장된 액션 : " + obj.c_state + "<br>\n" +
						"  저장된 액션 : " + obj.c_method + "<br>\n" +
						"  저장된 파일 이름 : " + obj.fileName + "<br>\n" +
						"  저장된 파일 타입 : " + obj.contentType + "\n" +
						"  </div>\n" +
						" </div>\n" +
						"</li>";
					$('.timeline.timeline-inverse').append(add_t_arms_filerepository);
				}

			}else if(isEmpty(obj.fileIdLink) && !isEmpty(obj.c_pdservice_jira_ids) && isEmpty(obj.c_jira_con_passmode) && isEmpty(obj.c_end_date) && isEmpty(obj.c_fileid_link) && isEmpty(obj.c_req_status)){
				//t_arms_pdserviceconnect

			}else if(isEmpty(obj.fileIdLink) && isEmpty(obj.c_pdservice_jira_ids) && !isEmpty(obj.c_jira_con_passmode) && isEmpty(obj.c_end_date) && isEmpty(obj.c_fileid_link) && isEmpty(obj.c_req_status)){
				//t_arms_pdservicjira

			}else if(isEmpty(obj.fileIdLink) && isEmpty(obj.c_pdservice_jira_ids) && isEmpty(obj.c_jira_con_passmode) && !isEmpty(obj.c_end_date) && isEmpty(obj.c_fileid_link) && isEmpty(obj.c_req_status)){
				//t_arms_pdservicversion

			}else if(isEmpty(obj.fileIdLink) && isEmpty(obj.c_pdservice_jira_ids) && isEmpty(obj.c_jira_con_passmode) && isEmpty(obj.c_end_date) && !isEmpty(obj.c_fileid_link) && isEmpty(obj.c_req_status)){
				//t_arms_pdservice

			}else if(isEmpty(obj.fileIdLink) && isEmpty(obj.c_pdservice_jira_ids) && isEmpty(obj.c_jira_con_passmode) && isEmpty(obj.c_end_date) && isEmpty(obj.c_fileid_link) && !isEmpty(obj.c_req_status)){
				//t_arms_reqadd
				var timestamp_t_arms_reqadd = new Date(obj.c_date);
				var datetime_t_arms_reqadd = timestamp_t_arms_reqadd.getFullYear()+"/"+(timestamp_t_arms_reqadd.getMonth()+1)+"/"+timestamp_t_arms_reqadd.getDate()+
					" "+timestamp_t_arms_reqadd.getHours()+":"+timestamp_t_arms_reqadd.getMinutes();

				var add_t_arms_reqadd =
					"<li class=\"timeline-item-body\">\n" +
					"	<i class=\"fa fa-check-square-o bg-maroon\"></i>\n" +
					"	<div class=\"timeline-item\">\n" +
					"		<span class=\"arrow\"></span>\n" +
					"		<span class=\"time\"><i class=\"fa fa-clock-o\"></i>" + datetime_t_arms_reqadd + "</span>\n" +
					"		<h3 class=\"timeline-header\"><a href=\"#\">기획</a> <small class=\"font11\">요구사항 등록,변경,삭제 로그</small></h3>\n" +
					"		<div class=\"timeline-body col-md-4 font11\">\n" +
					"			<a href=\"#\" target=\"_blank\" class=\"btn bg-maroon btn-xs\" style=\"font-size: 11px;\"><i class=\"fa fa-share\"></i> 로그 자세히 보기</a>\n" +
					"		</div>\n" +
					" <div class=\"timeline-footer col-md-8 font12 fontw600\">\n" +
					"  저장된 액션 : " + obj.c_state + "<br>\n" +
					"  저장된 액션 : " + obj.c_method + "<br>\n" +
					"  저장된 요구사항 이름 : " + obj.c_title + "<br>\n" +
					"  저장된 제품(서비스) 아이디 : " + obj.c_pdservice_link + "<br>\n" +
					"  저장된 요구사항 상태 : " + obj.c_req_status + "\n" +
					"  </div>\n" +
					" </div>\n" +
					"</li>";
				$('.timeline.timeline-inverse').append(add_t_arms_reqadd);

			}else{
				console.log("정의되지 않은 타입의 객체 데이터 확인 :: " + obj);
			}

		}//for end

		var endPointHtmlStr = "<!-- END timeline item -->\n" +
			"                                    <li class=\"timeline-item-body\">\n" +
			"                                        <i class=\"fa fa-clock-o bg-gray\"></i>\n" +
			"                                    </li>";
		$('.timeline.timeline-inverse').append(endPointHtmlStr);

	}).fail(function(e) {
	}).always(function() {
	});


});

///////////////////////////////////////////////////////////////////////////////
// 전체 AJAX 통신에 대한 이벤트 콜백 처리.
///////////////////////////////////////////////////////////////////////////////
$(document)
	.ajaxStart(function(){
		jNotify('<span class="spinner"><i class="fa fa-spinner fa-spin"></i> 서버와 통신 중 입니다.</span>');
	})
	.ajaxStop(function(){
		console.log("ajaxStop");
	})
	.ajaxComplete(function(){
		console.log("ajaxComplete");
	})
	.ajaxSuccess(function(){
		console.log("ajaxComplete");
	})
	.ajaxError(function(){
		console.log("ajaxComplete");
	})
	.ajaxSend(function(){
		console.log("ajaxComplete");
	});

///////////////////////////////////////////////////////////////////////////////
// 탭 클릭 이벤트
///////////////////////////////////////////////////////////////////////////////
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	var target = $(e.target).attr("href"); // activated tab

	if (target == "#jira") {
		console.log("jira tab click event");
		//1-1. 제품(서비스) 아이디를 기준으로, -- $('#country').val()
		//1-2. 요구사항 jsTree ID 가져와서 -- selectedJsTreeId
		//2. 요구사항 테이블 ( REQADD ) 을 검색하여
		//3. JIRA_VER 정보에 체크해 주기.
		//제품 서비스 셀렉트 박스 데이터 바인딩
		//요구사항 클릭하면 자세히보기 탭으로 가니까 이 로직은 유효하다.
		var tableName = "T_ARMS_REQADD_" + $('#country').val();
		$.ajax({
			url: "/auth-user/api/arms/reqAdd/" + tableName + "/getNode.do",
			data: {
				c_id: selectedJsTreeId
			},
			type: "GET",
			contentType: "application/json;charset=UTF-8",
			dataType : "json",
			progress: true
		}).done(function(data) {

			console.log(data.c_jira_ver_link);

			for(var key in data){
				var value = data[key];
				//console.log(key + "=" + value);
			}

			if(isEmpty(data.c_jira_ver_link)){
				console.log("jiraVerArr is empty");
			}else{
				var jiraVerArrStr = data.c_jira_ver_link;
				//특수 문자 중에 콤마는 빼고 지움
				var reg = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
				jiraVerArrStr = jiraVerArrStr.replace(reg,'');
				var jiraVerArr = jiraVerArrStr.split(',');

				var loopCount = jiraVerArr.length;

				for (var i = 0; i< loopCount ; i++) {
					console.log( "loop check i = " + i );
					console.log( "loop check value = " + jiraVerArr[i] );
					$("input:checkbox[value='" + jiraVerArr[i] +"']").prop("checked", true);
				}
			}

		}).fail(function(e) {
		}).always(function() {
		});

	}
});

///////////////////////////////////////////////////////////////////////////////
// 요구사항 - 지라 연결 변경 버튼 클릭 이벤트
///////////////////////////////////////////////////////////////////////////////
$("#req_JiraVer_Connect_Change").click(function () {

	console.log("req_JiraVer_Connect_Change");

	//JiraVersion 정보 셋팅
	var chk_Val = [];
	$("input:checkbox[name=jiraVerList]:checked").each(function(i,iVal) {
		chk_Val.push(iVal.value);
	});
	console.log(JSON.stringify(chk_Val));

	//반영할 테이블 네임 값 셋팅
	var tableName = "T_ARMS_REQADD_" + $('#country').val();
	
	$.ajax({
		url: "/auth-user/api/arms/reqAdd/" + tableName + "/updateNode.do",
		data: {
			c_id: selectedJsTreeId,
			c_version_link: "[]",
			c_jira_link: "independent",
			c_jira_ver_link: JSON.stringify(chk_Val)
		},
		type: "POST",
		progress: true
	}).done(function(data) {

		for(var key in data){
			var value = data[key];
			console.log(key + "=" + value);
		}

		var loopCount = 3;
		for (var i = 0; i < loopCount ; i++) {
			console.log( "loop check i = " + i );
		}

	}).fail(function(e) {
	}).always(function() {
	});

});