<?php
/**
 * @file
 * Contains \Drupal\resume\Form\ResumeForm.
 */
namespace Drupal\tacbiocn_order\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class OrderForm extends FormBase {

  /**
   * {@inheritdoc}
   */

  public function getFormId() {
    return 'order_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['#theme'] = 'order_form';

    $form['#attached'] = array(
        'library' => 'tacbiocn_order/tacbiocn_order.library'
    );

    $form['#attributes'] = array('class' => 'well', 'style' => 'margin: 0 -15px');

    $form['deliverydate'] = array(
      '#type' => 'textfield',
      '#attributes' => array(
          'class' => array(
              'datepicker-text',
          ),
          'placeholder' => t('Desired first delivery date (MM/DD/YYYY) / 期望的第一个交货日期'),
      ),
      '#title' => t('Desired Delivery Date / 期望的交货日期:'),
      '#required' => TRUE,
    );

    $form['freq'] = array(
      '#type' => 'select',
      '#title' => t('Frequency of Order / 订单频率:'),
      '#options' => array(
        'One Time Spot Order' => t('One Time Spot Order / 一次性现货订单'),
        'Weekly' => t('Weekly / 每周'),
        'Biweekly' => t('Biweekly / 每两周一次'),
        'Monthly' => t('Monthly / 每月一次'),
        'Quarterly' => t('Quarterly / 季刊')
      ),
      '#required' => TRUE,
    );

    $form['specialreqs'] = array(
        '#type' => 'textarea',
        '#title' => t('Requirements or Comments / 要求或评论:'),
        '#attributes' => array (
            'placeholder' => t('Please do not enter Credit Card information in this field / 请不要在此字段中输入信用卡信息'),
        ),
    );

    $form['mastercustomer'] = array(
        '#type' => 'textfield',
        '#title' => 'Taconic Master Customer Number / 主客户编号',
        '#attributes' => array (
            'placeholder' => t('Enter your Master Customer Number / 输入您的主客户编号'),
        ),
        '#required' => TRUE
    );

    $form['existinstitution'] = array(
        '#type' => 'textfield',
        '#title' => 'Institution / 机构',
        '#attributes' => array (
            'placeholder' => t('Institution / 机构'),
        ),
    );

    $form['shipaddress'] = array(
        '#type' => 'textfield',
        '#title' => 'Taconic Ship to Address Number / 收货地址',
        '#attributes' => array (
            'placeholder' => t('Enter your Ship to Address Number / 输入您的收货地址'),
        ),
        '#required' => TRUE
    );

    $form['shipstreetaddress'] = array(
        '#type' => 'textfield',
        '#title' => 'Ship to Street Address Number / 运送到街道地址',
        '#attributes' => array (
            'placeholder' => t('Enter Your Ship to Street Address Number / 输入您的船到街道地址号码'),
        ),
    );

    $form['shipcity'] = array(
        '#type' => 'textfield',
        '#title' => 'Ship to City / 运送到城市',
        '#attributes' => array (
            'placeholder' => t('Ship to City / 运送到城市'),
        ),
    );

    $form['shipstate'] = array(
        '#type' => 'textfield',
        '#title' => 'Ship to Province / 运送到省',
        '#attributes' => array (
            'placeholder' => t('Ship to Province / 运送到省'),
        ),
    );

    $form['shipzip'] = array(
        '#type' => 'textfield',
        '#title' => 'Postal Code / 邮政编码',
        '#attributes' => array (
            'placeholder' => t('Postal Code 邮政编码'),
        ),
    );

    $form['shipcountry'] = array(
      '#type' => 'select',
      '#title' => t('Ship to Country / 运送到国家'),
      '#options' => array(
          'CHN' => t('China / 中国')
      )
    );
    $form['shipcountry']['#default_value'] = 'CHN';



    $form['invoiceaddress'] = array(
        '#type' => 'textfield',
        '#title' => 'Taconic Invoice Address Number / 发票地址号码',
        '#attributes' => array (
            'placeholder' => t('Enter Taconic Invoice Address Number / 输入发票地址号码'),
        ),
        '#required' => TRUE
    );

    $form['invoicestreetaddress'] = array(
        '#type' => 'textfield',
        '#title' => 'Invoice to Street Address Number / 发票到街道地址号码',
        '#attributes' => array (
            'placeholder' => t('Invoice to Street Address / 发票到街道地址号码'),
        ),
    );

    $form['invoicecity'] = array(
        '#type' => 'textfield',
        '#title' => 'Invoice to City / 到城市的发票',
        '#attributes' => array (
            'placeholder' => t('Invoice to City / 到城市的发票'),
        ),
    );

    $form['invoicestate'] = array(
        '#type' => 'textfield',
        '#title' => 'Invoice to Province / 发票到省',
        '#attributes' => array (
            'placeholder' => t('Invoice to Province / 发票到省'),
        ),
    );

    $form['invoicezip'] = array(
        '#type' => 'textfield',
        '#title' => 'Postal Code / 邮政编码',
        '#attributes' => array (
            'placeholder' => t('Postal Code / 邮政编码'),
        ),
    );

    $form['invoicecountry'] = array(
      '#type' => 'select',
      '#title' => t('Invoice to Country / 发票到国家'),
      '#options' => array(
          'CHN' => t('China / 中国')
      ),
      '#required' => TRUE
    );
    $form['invoicecountry']['#default_value'] = 'CHN';

    $form['investigatorname'] = array(
        '#type' => 'textfield',
        '#title' => 'Investigator Name / 研究者姓名',
        '#attributes' => array (
            'placeholder' => t('Liu Yang / 刘洋'),
        ),
        '#required' => TRUE
    );

    $form['contactname'] = array(
        '#type' => 'textfield',
        '#title' => 'Contact Name / 联系人姓名',
        '#attributes' => array (
            'placeholder' => t('Li Wei / 李伟'),
        ),
    );

    $form['existingemail'] = array(
      '#type' => 'email',
      '#title' => t('Contact Email Address / 联络电子邮件地址'),
      '#attributes' => array (
          'placeholder' => t('li.wei@email.com'),
      ),
      '#required' => TRUE,
    );

    $form['contactphonenumber'] = array (
      '#type' => 'tel',
      '#attributes' => array (
          'placeholder' => t('+55 555 5555 5555'),
      ),
      '#title' => t('Contact Phone Number / 联系电话'),
    );

    $form['paybycard'] = array (
      '#type' => 'radios',
      '#title' => ('Pay by credit card / 用信用卡付款:'),
      '#options' => array(
        'Yes' =>t('Yes / 是'),
        'No' =>t('No / 没有')
      ),
      '#required' => TRUE,
    );

    $form['cclast4'] = array(
        '#type' => 'textfield',
        '#title' => 'Last 4 of card / 最后四个信用卡号:',
        '#attributes' => array (
            'placeholder' => t('####'),
        ),
    );

    $form['existordernumber'] = array(
        '#type' => 'textfield',
        '#title' => 'Purchase Order Number / 订购单号码',
        '#attributes' => array (
            'placeholder' => t('Enter Your Purchase Order Number / 输入您的采购订单号'),
        ),
    );

    $form['existreleasenumber'] = array(
        '#type' => 'textfield',
        '#title' => 'Release # / 发行编号',
        '#attributes' => array (
            'placeholder' => t('Enter Your Release Number / 输入您的发行编号'),
        ),
    );

    $form['orders'] = array(
        '#type' => 'hidden',
        '#attributes' => array (
            'id' => 'orders',
        )
    );

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Submit / 提交 <i class="fa fa-angle-double-right"></i>'),
      '#button_type' => 'primary',
      '#attributes' => array (
          'class' => array(
              'class' => 'continue_button'
          ),
          'id' => 'mailbutton1'
      )
    );
    return $form;
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {


      function sendMail($recipientEmail,$senderEmail,$subject,$message){
          // email fields
          $headers = "From: $senderEmail";
          $headers .= "\nContent-Type: text/html";

          return @mail($recipientEmail, $subject, $message, $headers);
      };

      $recipientEmail = 'kevin.masters@taconic.com, anthony.finta@taconic.com';
      // $recipientEmail = 'kevin.masters@taconic.com';
      $senderEmail = 'kevin.masters@taconic.com';
      $subject = 'China Order Form';
      $message = "<html><body>\n";

      $message .= <<< MESSAGE
      		Thank you for your order. We have included a copy of your order request in this email for your records. If you notice any errors, contact Taconic Customer Service immediately. If any questions arise, Taconic will contact you.
      		Within one (1) business day, a confirmation of your order will be provided to you by telephone, fax or e-mail. This order is not a confirmed order until Taconic has issued you a Confirmation Number.<br><br>
            <p>谢谢您的订单。您的订购请求的副本将通过电子邮件发送给您。</p>
            <p>如果发现任何错误，请立即联系Taconic客户服务。如有任何疑问，Taconic将与您联系。在一个工作日内，将通过电话，传真或电子邮件向您提供订单确认。</p>
            <p>在Taconic向您发出确认编号之前，此订单不是确认订单。</p>
      MESSAGE;

      $message .= "<h2>Order information:</h2>\n";



   // drupal_set_message($this->t('@can_name ,Your application is being submitted!', array('@can_name' => $form_state->getValue('candidate_name'))));


   $modelInfoTitles = ['Model','Quantity','Health Status','Genotype','Sex','Range Type','Min','Max','Comments'];
   $modelInfo = ['model','quantity','healthstatus','genotype','sex','rangeType','min','max','comment'];

   $translateLabels = array('mastercustomer' => 'Master Customer Number',
   	'existinstitution' => 'Institution',
   	'shipaddress' => 'Ship To Address Number',
   	'shipstreetaddress' => 'Ship To Street Address',
   	'shipcity' => 'Ship To City',
   	'shipstate' => 'Ship To State',
   	'shipzip' => 'Ship To Zip',
   	'shipcountry' => 'Ship To Country',
   	'invoiceaddress' => 'Invoice To Address Number',
   	'invoicestreetaddress' => 'Invoice To Street Address',
   	'invoicecity' => 'Invoice To City',
   	'invoicestate' => 'Invoice To State',
   	'invoicezip' => 'Invoice To Zip',
   	'invoicecountry' => 'Invoice To Country',
   	'investigatorname' => 'Investigator Name',
   	'contactname' => 'Contact Name',
   	'existingemail' => 'Contact Email',
   	'contactphonenumber' => 'Contact Phone Number',
   	'paybycard' => 'Pay By Credit',
   	'cclast4' => 'Last 4 Digits of Card',
   	'existordernumber' => 'Purchase Order Number',
   	'existreleasenumber' => 'Release Number',
   	'ordernumber' => 'Purchase Order Number',
   	'releasenumber' => 'Release Number',
   	'firstname' => 'First Name',
   	'lastname' => 'Last Name',
   	'title' => 'Title',
   	'institution' => 'Institution',
   	'streetaddress' => 'Street Address',
   	'city' => 'City',
   	'state' => 'State',
   	'zip' => 'Zip or Postal Code',
   	'country' => 'Country',
   	'fax' => 'Fax',
   	'phone' => 'Phone Number',
   	'email' => 'Email',
   	'confirmationby' => 'Confirmation By',
   	'deliverydate' => 'Desired Delivery Date',
   	'freq' => 'Frequency of Order',
   	'specialreqs' => 'Requirements or Comments',
   	'model' => 'Model',
   	'quantity' => 'Quantity',
   	'healthstatus' => 'Health Status',
   	'genotype' => 'Genotype',
   	'sex' => 'Sex',
   	'rangeType' => 'Range Type',
   	'minrange' => 'Min',
   	'maxrange' => 'Max',
   	'comment' => 'Comments',
   	'procedures' => 'Procedure(s)',
   	'type' => 'Item code');

    $message .= "<strong>Customer Info</strong><br>\n";

    function translateLabel($key,$translateLabels) {
        if(array_key_exists($key,$translateLabels)) {
            return $translateLabels[$key];
        }
    }

    foreach ($form_state->getValues() as $key => $value) {
      //drupal_set_message($key . ': ' . $value);
$keyLabel = translateLabel($key,$translateLabels);
      if($keyLabel != '') {
            $message .= $keyLabel . ': ' . $value . "<br>\n\r";

      }


    }

   $order = $form_state->getValue('orders');

   $orderDecoded = json_decode($order);

   $orderStr = "<br><strong>Orders:</strong><br>\n";

    foreach ($orderDecoded as $mvalue) {
        $orderStr .= "Model:<br>";
        foreach ($mvalue as $mkey => $mval) {

            //echo $key . ':' . $val . "\n";
            if(in_array($mkey, $modelInfo)) {
                $keyinfo = array_search($mkey, $modelInfo);
                $orderStr .= "$modelInfoTitles[$keyinfo]: $mval<br>\n";
            }
        }
    }


    $message .= $orderStr;

    $message .= "\n</body></html>";

    sendMail($recipientEmail,$senderEmail,$subject,$message);


        //drupal_set_message($message);

        drupal_set_message($this->t('<p>Thank you for your order. A copy of your order request will be emailed to you.</p><p>If you notice any errors, contact Taconic Customer Service immediately. If any questions arise, Taconic will contact you. Within one (1) business day, a confirmation of your order will be provided to you by telephone, fax or e-mail.</p><p>This order is not a confirmed order until Taconic has issued you a Confirmation Number.</p><p>&nbsp;</p>
        <p>谢谢您的订单。您的订购请求的副本将通过电子邮件发送给您。</p>
        <p>如果发现任何错误，请立即联系Taconic客户服务。如有任何疑问，Taconic将与您联系。在一个工作日内，将通过电话，传真或电子邮件向您提供订单确认。</p>
        <p>在Taconic向您发出确认编号之前，此订单不是确认订单。</p>'));
   }

}
