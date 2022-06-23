/**
 * @file
 * JavaScript for tacbiocn_order.
 */

(function ($) {

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    let selectModels = document.getElementById('modelselect');
    let selectHealth = document.getElementById('healthstatus');
    let selectGenotype = document.getElementById('zygosity');
    let selectSex = document.getElementById('sex');
    let inputURL = document.getElementById('modelURL');

    $('#usSelectTab').on('click', function(e){
        e.preventDefault();
        if(!$(this).parent('li').hasClass('active')) {
            $('#chinaSelectTab').parent('li').removeClass('active');
            $(this).parent('li').addClass('active');
            $('#chinaSelect').hide();
            $('#usSelect').show();
        }
    });
    $('#chinaSelectTab').on('click', function(e){
        e.preventDefault();
        if(!$(this).parent('li').hasClass('active')) {
            $('#usSelectTab').parent('li').removeClass('active');
            $(this).parent('li').addClass('active');
            $('#usSelect').hide();
            $('#chinaSelect').show();
        }
    })

    $('#edit-deliverydate').datepicker();
    const fillOptions =(select,value)=> {
        let node = document.createElement('option');
        let optionText = document.createTextNode(value);
        let modelNo = value;
        node.value = value;
        node.appendChild(optionText);
        select.appendChild(node);
    }

    const fillNext =(select,value)=> {
        //clears previous options

            select.innerHTML = '<option value="">Choose available option / 选择可用的选项</option>';

        // add relevant values
        if(Array.isArray(value)) {
            for(i=0;i<value.length;i++) {
                fillOptions(select,value[i]);
            }
            if(value.length == 1) {
                select[1].selected = 'selected';
            }
        } else {
            fillOptions(select,value);
            select[1].selected = 'selected';
        }
        $(".selectpicker").selectpicker("refresh");
    }

    //console.log('get US models');
    let usmodelselect = document.getElementById('modelselect-usm');
    let usmodeldropdown = '';
    $.getJSON("/sites/default/files/catalog_models.json", function(usdata) {
        function compare(a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();

            var comparison = 0;
            if(nameA > nameB) {
                comparison = 1;
            }
            return comparison;
        }

        usdata.sort(compare);

        let removedModels = [
            'CIEA BRG mouse','CIEA NOG <span style="text-transform: lowercase;">mouse&reg;</span>','hIL-15 NOG','hIL-2 NOG',
            'hIL-6 NOG','huNOG','huNOG-EXL','huPBMC-NOG',
            'NOG-EXL (hGM-CSF/hIL-3 NOG)','rasH2','TK-NOG'
        ];
        for(us=0;us<usdata.length;us++) {

            let usModelName = usdata[us].name;

            if(removedModels.indexOf(usModelName)>-1) {
                //console.log('omitted: '+usModelName);
            } else {
                //console.log(usModelName);

                // this removes the html from that TNF-&alpha; and any others
                usModelName = usModelName.replace(/<[^>]*>?/gm, '');
                usmodeldropdown += `<option value="${usModelName}">${usModelName}</option>`;
            }



        }
        $('#modelselect-usm').append(usmodeldropdown);

        $('#modelselect-usm').on('change', function(e){
            if (e.target.value.length > 0){
                let chosen = e.target.value;

                function isSelected(element) {
                    return element.name == e.target.value;
                }
                let modelIndex = (usdata.findIndex(isSelected));

                let healthStandard = (usdata[modelIndex].healthStatus);

                let genoType = (usdata[modelIndex].available_zygosities.F);
                let modelSex = ['Male / 男','Female / 女'];

                fillNext(document.getElementById('healthstatus'),healthStandard);

                if(genoType == ""){
                    document.getElementById('zygosity').innerHTML = '<option>No genotype options b/ 没有基因型选择</option>';
                } else {
                    fillNext(document.getElementById('zygosity'),genoType);
                }

                fillNext(document.getElementById('sex'),modelSex);


                    $(".selectpicker").selectpicker("refresh");
            }
        });


    });

  //console.log('order page start');


  let url = '/jsonapi/node/chinese_models';
  let modeldropdown = '';
  $.getJSON(url, function(data) {
    let livemodels = data.data;

    const modelOptions=(selected)=>{
        function isSelected(element) {
            return element.attributes.title == selected;
        }

        let modelIndex =  livemodels.findIndex(isSelected);
        let genoType = livemodels[modelIndex].attributes.field_genotype;
        let modelSex = livemodels[modelIndex].attributes.field_sex;

        if(genoType == ""){
            document.getElementById('zygosity').innerHTML = '<option>No genotype options / 没有基因型选择</option>';
        } else {
            fillNext(document.getElementById('zygosity'),genoType);
        }
        fillNext(document.getElementById('sex'),modelSex);

        murl = (url+"/"+livemodels[modelIndex].id+"?include=field_flyer,field_health_standard");
        $.getJSON(murl, function(mdata) {

            let fileArr = [];
            let healthArr = [];

            for(d=0;d<mdata.included.length;d++) {

                if(mdata.included[d].type == 'file--file') {
                    fileArr.push(mdata.included[d].attributes.filename)
                } else {
                    healthArr.push(mdata.included[d].attributes.name)
                }
            }

            if(healthArr.length > 1) {
                fillNext(document.getElementById('healthstatus'),healthArr);


                $('#healthstatus').on('change', function(e){
                    let selectHealth = $('#healthstatus')[0].selectedIndex -1;
                    inputURL.value = fileArr[selectHealth];
                })

            } else {
                fillNext(document.getElementById('healthstatus'),healthArr[0]);
                inputURL.value = fileArr[0];
            }

        })
    }

    for(m=0;m<livemodels.length;m++) {
        modeldropdown += `<option value="${livemodels[m].attributes.title}">${livemodels[m].attributes.title}</option>`;

        // removes redundant Live Models from the US select tab

        if(jQuery("#modelselect-usm option[value='"+livemodels[m].attributes.title+"']").length > 0) {
            //console.log('removed ' + livemodels[m].attributes.title);
            jQuery("#modelselect-usm option[value='"+livemodels[m].attributes.title+"']").remove();
        }


    }

    $('#modelselect').append(modeldropdown);
    $("#modelselect-usm").selectpicker("refresh");


    // preselect model if clicked from Live Models page or homepage
        if(getParameterByName('model')) {

            let orderSelect = getParameterByName('model');
                //console.log(orderSelect);

                if($("#modelselect option[value='"+orderSelect+"']").length>0) {

                    function setModelOption(select) {

                        jQuery('#modelselect').val(select)
                        jQuery('#modelselect').selectpicker('refresh');

                        modelOptions(select);
                    }

                    setModelOption(orderSelect);
                }


        } else {
            //console.log('no preselected');
        }
    $('#modelselect').selectpicker('refresh');

    $('#modelselect').on('change', function(e){
        let selectedModel = e.target.value;



        modelOptions(selectedModel);

        $(".selectpicker").selectpicker("refresh");
    });
  });

  let orders = [];
  const addToOrder = () => {
    //console.log('added')
    let orderline = {};
    let emptyfields = [];
    orderline.quantity = $("#qty").val();
    if (!orderline.quantity) {
      emptyfields.push("quantity / 数量");
    }

    if($("#modelselect").val()) {
        orderline.model = $("#modelselect")
          .selectpicker()
          .val();
    } else if($("#modelselect-usm").val()) {
        orderline.model = $("#modelselect-usm")
          .selectpicker()
          .val();
    }

    if (!orderline.model) {
      emptyfields.push("model / 模型");
    }

    orderline.sex = $("#sex")
      .selectpicker()
      .val();
    if (!orderline.sex) {
      emptyfields.push("sex / 性别");
    }
    orderline.genotype = $("#zygosity")
      .selectpicker()
      .val();
    if (!orderline.genotype) {
        emptyfields.push("genotype / 基因型");
    }
    orderline.healthstatus = $("#healthstatus")
      .selectpicker()
      .val();
    if (!orderline.healthstatus) {
        emptyfields.push("Health Standard / 卫生标准");
    }
    orderline.rangeType = $("input:radio[name=rangeType]:checked").val();
    //orderline.rangeType = 'Weeks';
    orderline.maxrange = $("#" + orderline.rangeType + "Max")
      .val();
    orderline.minrange = $("#" + orderline.rangeType + "Min")
      .val();

    orderline.comment = $("#modComment1").val();

    orderline.modelURL = $("#modelURL").val();
    if (emptyfields.length) {
      alert(
        "Please add following information to your order first / 请先在您的订单中添加以下信息: " +
          emptyfields.join(", ")
      );
      return false;
    }
    orders.push(orderline);


  // RESET THE MODEL SELECT
  document.getElementById('dummyform').reset();
  $('#modelselect').selectpicker('refresh');
  $(".selectpicker").selectpicker("refresh");
  }


  revQuant = function(id,val) {
    orders[id].quantity = val;
    renderOrders();
  }

  const renderOrders = () => {
  var ordersHtml =
    '<h3>Order Summary / 订单摘要:</h3><div class="table-responsive"><table class="table-condensed"><tbody style="vertical-align:top"><tr>\
    <th>Model / 模型</th>\
    <th>Quantity / 数量</th>\
    <th>Health Status / 健康状况</th>\
    <th>Genotype / 基因型</th>\
    <th>Sex / 性别</th>\
    <th>Range Type / 范围类型</th>\
    <th>Comments / 注释</th>\
    <th class="remove-item"></th>\
    </tr>';
  for (i = 0; i < orders.length; i++) {
    var trclass = "";
    if (i % 2 > 0) {
      trclass = ' class="altRow"';
    }
    ordersHtml =
      ordersHtml +
      "<tr" +
      trclass +
      '>\
        <td><a href="./sites/default/files/pdf/' +
      orders[i].modelURL +
      '" target="_blank">' +
      orders[i].model +
      "</a></td>\
        <td><span class='show-item' style='display:none;'>" +
      orders[i].quantity +
      "</span><label class='remove-item'><span class='hidden'>qty: </span><input type='number' name='quantity' class='form-control' id='quantity' min='1' max='9999999' value='" +
      orders[i].quantity +
      "' onChange='return revQuant(" +
      i +
      ", this.value)' style='max-width: 70px; display: inline-block;'></label></td>\
        <td>" +
      orders[i].healthstatus
        .replace(/^.+?\(/, "")
        .replace(/\)/, "") +
      "</td>\
        <td>" +
      orders[i].genotype +
      "</td>\
        <td>" +
      orders[i].sex +
      "</td>\
        <td>" +
        orders[i].rangeType + ':<br>' +
      orders[i].minrange +
      " - " +
      orders[i].maxrange;

      if(orders[i].rangeType == 'Age') ordersHtml += ' weeks';

      ordersHtml +=

      "</td>\
        <td>" +

      orders[i].comment +
      '</td>\
        <td class="remove-item"><a href="#orderlist" onClick="return removeOrder(' +
      i +
      ')">X</a></td></tr>';
  }
  ordersHtml = ordersHtml + "</tbody></table></div>";

  if (orders.length > 0) {
    $("#liveshippinginfo").show();
  } else {
    ordersHtml = "";
    $("#liveshippinginfo").hide();
  }
  $("#orderlist").html(ordersHtml);

  // Populates the review table
  var reviewHtml =
  '<h3>Order Summary / 订单摘要:</h3><div class="table-responsive"><table class="table-condensed"><tbody style="vertical-align:top"><tr>\
  <th>Model / 模型</th>\
  <th>Quantity / 数量</th>\
  <th>Health Status / 健康状况</th>\
  <th>Genotype / 基因型</th>\
  <th>Sex / 性别</th>\
  <th>Range Type / 范围类型</th>\
  <th>Comments / 注释</th>\
  </tr>';
  for (i = 0; i < orders.length; i++) {
    var trclass = "";
    if (i % 2 > 0) {
      trclass = ' class="altRow"';
    }
    reviewHtml =
      reviewHtml +
      "<tr" +
      trclass +
      '>\
        <td><a href="./sites/default/files/pdf/' +
      orders[i].modelURL +
      '" target="_blank">' +
      orders[i].model +
      "</a></td>\
        <td>" +
      orders[i].quantity +
      "</td>\
        <td>" +
      orders[i].healthstatus
        .replace(/^.+?\(/, "")
        .replace(/\)/, "") +
      "</td>\
        <td>" +
      orders[i].genotype +
      "</td>\
        <td>" +
      orders[i].sex +
      "</td>\
        <td>" +
      orders[i].minrange +
      "-" +
      orders[i].maxrange +
      " " +
      orders[i].rangeType +
      "</td>\
        <td>" +
      orders[i].procedure + '<br>' +
      orders[i].comment +
      "</td></tr>";
  }
  reviewHtml = reviewHtml + "</tbody></table></div>";

  $("#orderReviewList").html(reviewHtml);

  }

  let addOrderButton = document.getElementById('firstAddButton');

  addOrderButton.addEventListener('click', function(){
    addToOrder();
    renderOrders();
    //console.log('order object: ')
    //console.log(orders);
  });

  removeOrder = function(id) {
  orders.splice(id, 1);
  // Re-render both order lists, because the count needs to be decreased on the other tab
  renderOrders();
  // Cookies.set("ordercookie", JSON.stringify(orders), {
  //   path: "/"
  // });
  return false;
  };

  $('input:radio[name=paybycard]').change(function(){
    if (this.value == 'yes') {
            $('#cclast4div').show();
            $('#cclast4').prop('required',true);
        }
        else if (this.value == 'no') {
            $('#cclast4div').hide();
            $('#cclast4').removeAttr('required');
        }
  })

  ///
  /// Switches view to order review after validating customer information and making sure
  /// there is an actual order
  ///
  const submitToMail = ()=> {
  let emptyfields = [];
  let customerInfo = {};

  customerInfo.delDate = $('#edit-deliverydate').val();
  if(!customerInfo.delDate){
      emptyfields.push('delivery date / 邮寄日期');
      $('#edit-deliverydate').parent('div').addClass('has-error');
  }

  customerInfo.orderFreq = $('#edit-freq').val();
  if(!customerInfo.orderFreq){
      emptyfields.push('order frequency / 订单频率');
      $('#edit-freq').parent('div').addClass('has-error');
  }
  // TODO: FINISH ADDING REQUIRED FIELD ERRORS

  customerInfo.custNumb = $('#edit-mastercustomer').val();
  customerInfo.custInst = $('#edit-existinstitution').val();
  customerInfo.custShipAddr = $('#edit-shipaddress').val();
  customerInfo.custInvAddr = $('#edit-invoiceaddress').val();
  customerInfo.custInvCountry = $('#edit-invoicecountry').val();
  customerInfo.custInvestigator = $('#edit-investigatorname').val();
  customerInfo.custEmail = $('#edit-existingemail').val();
  customerInfo.custccno = $('#edit-cclast4').val();

  const checkValid = (id,label,parentdiv,param) => {
      if($(id).attr("required")) {
          if(!param) {
              emptyfields.push(label);
              $(parentdiv).addClass('has-error');
          }
      }
  }

  checkValid('#edit-mastercustomer','master customer number / 主客户编号','#divmastercustomernumber',customerInfo.custNumb);
  checkValid('#edit-existinstitution','institution name / 机构名称','#divinstitution',customerInfo.custInst);
  checkValid('#edit-shipaddress','ship to address number /运送至地址','#divshipaddress',customerInfo.custShipAddr);
  checkValid('#edit-invoicecountry','invoice to country / 发票到国家','#countryWrap',customerInfo.custInvCountry);
  checkValid('#edit-invoiceaddress','invoice to address number / 发票至地址','#divinvoice',customerInfo.custInvAddr);
  checkValid('#edit-investigatorname','investigator name / 调查员姓名','#divinvestigator',customerInfo.custInvestigator);
  checkValid('#edit-existingemail','contact email / 联系电子邮件','#divexistingemail',customerInfo.custEmail);
  checkValid('#edit-cclast4','last 4 credit card numbers / 最后四个信用卡号','#cclast4div',customerInfo.custccno);

  //console.log("START: submitToMail");

  if (orders.length < 1) {
    //console.log("There are no orders");
    alert("Please add at least one model to your order first! / 请至少在您的订单中添加至少一个型号");
    return false;
  }

  //console.log("There are orders! " + orders.length);


  if (emptyfields.length) {
    alert(
      "Please add following information to your order first / 请先在您的订单中添加以下信息: " +
        emptyfields.join(", ")
    );
    return false;
  }


      // If everything in the form is valid, put the orders list in the hidden 'orders'
      // form field formatted as JSON, clear the orders cookie, save personal info in
      // another cookie and submit the form
      let valid_section1 = true;
      if (valid_section1) {
        $("#orders").val(JSON.stringify(orders));

        $("#order-form label").each(function() {
          var labeltext = $(this).text();
          var labelfor = $(this).attr("for");
          if (!labeltext.endsWith(":")) labeltext += ":";

          if (labelfor) {
            var labelval = $("*[id=" + labelfor + "]").val();
            if (labelval != "") {
              //console.log(labeltext + " = " + labelval);
              $("#formsummary #fields").append(
                "<p class='item " +
                  labelfor +
                  "'><strong>" +
                  labeltext +
                  "</strong><br>" +
                  labelval +
                  "</p>"
              );
            }
          }
        });

        $(
          "#order-form, #startIntro, #orderleftcolumn, #orderrightcolumn, input#orders, #liveshippinginfo, #startAnOrderForm, .remove-item, #mailbutton2"
        ).hide();
        $("#confirmIntro, #formsummary, .show-item").show();
        $("#confirmIntro")
          .get(0)
          .scrollIntoView();
      }
      //console.log("END: submitToMail");
  }

  const correctOrder = () => {
    //console.log("return");
    $(
      "#order-form, #startIntro, #orderleftcolumn, #orderrightcolumn, input#orders, #liveshippinginfo, #startAnOrderForm, .remove-item, #mailbutton2"
    ).show();
    $("#confirmIntro, #formsummary, .show-item").hide();
    $("#formsummary #fields").html("");
    $("#startIntro")
      .get(0)
      .scrollIntoView();
  }

  $('#mailbutton1').click(function(e){
    e.preventDefault();
    submitToMail();
  })

  $("#returnbutton, #orderCorrect").click(function() {
    correctOrder();
  });


  // Customer info Toggle
  $("#divmastercustomernumber div a").click(function() {
  $(this)
    .parent()
    .parent()
    .removeClass('has-error')
    .hide();
    $('#edit-mastercustomer').removeAttr('required');
    $('#edit-existinstitution').prop('required',true);
    $('label[for=edit-existinstitution]').addClass('form-required')
  $("#divinstitution").show();
  });

  $("#divinstitution div a").click(function() {
  $(this)
    .parent()
    .parent()
    .removeClass('has-error')
    .hide();
    $('#edit-existinstitution').removeAttr('required');
    $('#edit-mastercustomer').prop('required',true);
  $("#divmastercustomernumber").show();
  });

  $("#divshipaddress div a").click(function() {
  $(this)
    .parent()
    .parent()
    .removeClass('has-error')
    .hide();
    $('#edit-shipaddress').removeAttr('required');
  $("#divshipstreetaddress").show();
  });

  $("#divshipstreetaddress div div a").click(function() {
  $(this)
    .parent()
    .parent()
    .parent()
    .hide();
    $('#edit-shipaddress').prop('required',true);
  $("#divshipaddress").show();
  });

  $("#divinvoice div a").click(function() {
  $(this)
    .parent()
    .parent()
    .removeClass('has-error')
    .hide();
    $('#edit-invoiceaddress').removeAttr('required');
  $("#divinvoiceaddr").show();
  });

  $("#divinvoiceaddr div div a").click(function() {
  $(this)
    .parent()
    .parent()
    .parent()
    .hide();
    $('#edit-invoiceaddress').prop('required',true);
  $("#divinvoice").show();
  });

  $("input[name=paybycard]").click(function() {
    let choice = $(this).val();
    if(choice == 'Yes') {
        $('#cclast4div').show()
        $('#edit-cclast4').prop('required',true);
        $('label[for=edit-cclast4]').addClass('form-required')
    } else {
        $('#cclast4div').hide()
        $('#edit-cclast4').removeAttr('required');
    }
  })

  $("#gobutton").click(function() {
  $('#order-form').submit();
  //console.log('form submitted');
  });

})(jQuery);
