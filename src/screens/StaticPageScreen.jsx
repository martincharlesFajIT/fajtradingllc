import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const StaticPageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, content } = route.params;

  const getContent = () => {
    switch (content) {
      case 'privacy':
        return {
          sections: [
            {
              heading: 'What personal data we collect and why we collect it',
              text: 'This privacy policy (“Policy”) describes the privacy practices for fajtradingllc.com (“Website”) and outlines in which manner the Personal Data of users (“Customers”, “you”) is collected, stored, disclosed through the Website and physical stores and secured against misuse. It further identifies how Customers can correct any inaccuracies in the Personal Data provided. By using the Website, F A J Trading LLC, and/or products (together with “F A J Trading LLC” or “our Services”), you are consenting to the collection and processing of your Personal Data described in this Policy.For this Policy “Personal Data” shall mean any data relating to an identified natural person, or one who can be identified directly or indirectly by way of linking data, using identifiers such as name, voice, picture, identification number, online identifier, geographic location, or one or more special features that express the physical, psychological, economic, cultural or social identity of such person or any other data stated under this Policy.'
            },
            {
              heading: 'HOW WE COLLECT PERSONAL DATA ABOUT YOU',
              text: 'We may collect and process the following Personal Data about you when:\n\n• information that you provide us by filling in forms on our Website, including information provided at the time of registering to use our Website and other co-registrations (e.g. social media logins), subscribing to our Services, posting material or requesting further services.\n\n• The Personal Data you provide us for you to enter a competition or promotion via our Website, provide reviews, testimonials or feedback on our Website.\n\n• Personal Data you provide us, or that we may collect from you, to report a problem with our Website. \n\n• A record of correspondence if you contact us. \n\n• General, aggregated, demographic, and non-personal information \n\n• The details of transactions you carry out through our Website and of the fulfillment of your orders. \n\n•  The details about your computer, including but not limited to your IP address, operating system, and browser type, as well as information about your general internet usage (e.g. by using technology that stores Personal Data on or gains access to your device, such as cookies, tracking pixels, web beacons, etc., (together, “Cookies”)). \n\n• Your e-mail address from a third party if you indicate that you have consented to that third party sharing your Personal Data with us; and HOW WE USE YOUR PERSONAL DATA. \n\n The above personal information may be used for the following purposes: \n\n• Provide you with information about our offerings and/or our periodic newsletters (if the Customer provides its consent). \n Respond to your requests. \n\n• Fulfill any orders placed on our Website. \n• Create or develop business intelligence or data analytics in relation to the offerings provided by us (for this purpose we may share the Personal Data with certain software or tools available online if the required active and unambiguous consent is given by your end). \n• Manage our relationship with you.\n• Have internal record keeping. \n• verify your identity. \n• Maintain correct and up-to-date information \n about you. \n• Identify you as a contracting party.\n• Improve our Website \n• Be able to provide F A J Trading LLC to you. \n  administer and manage our incentives programs and fulfill your requests for incentives and/or to allow you to participate in sweepstakes and to notify you if you are a sweepstakes winner; and comply with our legal or statutory obligations.'
            },
            {
              heading: 'WHO HAS ACCESS TO YOUR DATA WITHIN OUR ORGANIZATION',
              text: 'Within our organization, access to your data is limited to those persons who require access to provide you with F A J Trading LLC, which you purchase from us, to contact you, and to respond to your inquiries, including refund requests. Those staff members may be part of the marketing or customer support teams. Staff members only have access to Personal Data that is relevant, on a ‘need to know’ basis. '
            },
            {
              heading: 'WHO DO WE SHARE YOUR DATA WITH OUTSIDE OUR ORGANIZATION AND WHY',
              text: '• Partners: We may make available to you further services, products, or applications provided by partners for use on or through our Website. If you choose to use such services, products or applications, your Personal Data related to those transactions may be shared with the respective partner.\n• Service Providers: We may share your Personal Data with the service providers. Examples include storing and analyzing Personal Data, protecting and securing our systems, providing search results and links, customer service, credit analysis, processing your information for profiling, user analysis and payment processing as well as delivery services.\n• Third Parties: We may also share your Personal Data with other third parties where you request or authorize us to do so provided that we comply with applicable law or it is required to respond to a valid legal process; or it is required to operate and maintain the security of our Website, including but not limited to prevention or stopping of an attack on our computer systems or networks. \n• Security: We carry out an assortment of regulatory, administrative, and specialized safety efforts to assist with safeguarding your Own Information. Our Organization has different inward control guidelines that relate explicitly to the treatment of Individual Information. These incorporate specific controls to assist with shielding the Individual Information we gather on the web. Our representatives are prepared to comprehend and agree with these controls and we convey our Strategy practices and rules to our workers. Be that as it may, while we endeavor to safeguard your Own Information, you should likewise do whatever it takes to safeguard your Own Information. We ask you to avoid potential risks to safeguard your Information while you are on the web.'
            },
            {
              heading: 'WHY AND FOR HOW LONG DO WE STORE INFORMATION WE COLLECT FROM YOU',
              text: 'We hold specific data gathered from you while you are a Client of F A J Trading LLC, and in specific situations where you have erased your record, for the accompanying motivations to: \n• Utilize our Sites \n• Ensure that we do not communicate with you if you have asked us not to \n• Provide you with a refund, if entitled.\n• Better understand the traffic to our Websites so that we can provide all members with the best possible experience.\n• Detect and prevent abuse of our Websites, illegal activities and breaches of our Terms and Conditions of F A J Trading LLC; and comply with applicable legal, regulatory, tax or accounting requirements. \n We retain Personal Data as long as necessary for the purposes described above. This means that we retain different categories of Personal Data for different periods of time depending on the type of Personal Data, the category of user to whom the Personal Data relates, and the purposes for which we collected the Personal Data.'
            },
            {
              heading: 'YOUR RIGHTS',
              text: 'You have certain rights if you are within the UAE includes:\n•    Right to access. This right allows you to obtain a copy of your Personal Data, as well as other supplementary information.\n• Right to restrict processing. You have the right to restrict the processing of your Data in certain circumstances.\n• Right to rectification. You have the right to have any incomplete or inaccurate Personal Data we hold about you corrected. \n•  Right to Processing and Automated Processing. You have the right to object to decisions issued concerning automated Processing that have legal consequences or seriously affect you, including profiling. \n• Right to object to processing. The right to object allows you to stop or prevent us from processing your Personal Data. This right exists where there are no legitimate reasons for us to continue processing your Personal Data. You also have the right to object where we are processing your Personal Data for direct marketing purposes. \n• Right to Request Personal Data Transfer. You have the right to obtain your Data provided to us for Processing in a structured and machine-readable manner, so long as the Processing is based on your consent or is necessary for the fulfillment of a contractual obligation and is made by automated means. You have the right to request the transfer of your Personal Data to another controller whenever this is technically feasible.\n• Right to erasure. You have the right to ask us to delete or remove Personal Data when the Personal Data is no longer necessary for the purpose for which we originally collected or processed. \n To exercise your rights, you can contact us at info@fajtradingllc.com'
            },
            {
              heading: 'LINKS TO OTHER WEBSITES',
              text: 'Our Website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third-party’s site. We strongly advise you to review the privacy policy of every website you visit. Third parties are under no obligation to comply with our Policy concerning Personal Data that you provide directly to those third parties or that those third parties collect for themselves. We do not control the third-party websites that may be accessible through our Website. Thus, this Policy does not apply to any information you provide to third-party websites or gathered by the third parties that operate them.'
            },
             {
              heading: 'CHANGES TO THIS STATEMENT',
              text: 'We may update our Policy from time to time. We will notify you of any changes by posting the new Policy on the Website. If we make any material change/s to the Policy we will notify you via email, through a notification posted on F A J Trading LLC, or as required by applicable law. You can see the latest version of the Policy by checking the date at the bottom of the Website. You are advised to review this Policy periodically for any changes. Changes to this Privacy Policy are effective from when they are posted on the Website.'
            },
            {
              heading: 'OUR POLICY CONCERNING MINORS & THEIR DATA',
              text: 'Our Website is not directed to minors under the age of eighteen and we do not knowingly collect personally identifiable information from minors or distribute such information to third parties. We screen users who wish to provide personal information to prevent minors from providing such information. If we become aware of having inadvertently received personally identifiable information from a minor, we will delete such information from our records. If we change our practices in the future, we will obtain prior, verifiable parental consent before collecting any personally identifiable information from minors.'
            }
          ]
        };

      case 'return':
        return {
          sections: [
            {
              heading: 'F A J Trading LLC Return and Exchange Policy',
              text: 'At Fajtradingllc.com, your satisfaction is our priority. If you are not satisfied with your purchase, we will accept returns of products within seven (7) days from the date of collection or delivery. \n Please review the following terms and conditions for returns and exchanges:'
            },
            {
              heading: 'Contact Information:',
              text: 'Customers can reach us by calling 971507063378, emailing us at sales@fajtradingllc.com, or contacting us via WhatsApp at +971507063378.'
            },
            {
              heading: 'Returns and Exchanges:',
              text: 'Accessories and Personal Care Items: \nReturns are accepted if the product is sealed and packed or if it has a manufacturing defect upon opening. No returns are accepted for opened products in good working condition.\n\n Hard Goods: \n The product must be in the same condition as when received (unopened, with the original packaging, including accessories, user manuals, warranty cards, and brand seals). For IT and telecom products, no returns are allowed once activated by the customer. \n\n Unopened Online Purchases: \nReturns and refunds do not apply to unopened online purchases. For opened items, returns are allowed but a restocking fee will apply. If you wish to receive unopened units, you must sign an acknowledgement releasing Fajtradingllc.com from any further claims.'
            },
            {
              heading: 'Required Documentation:',
              text: 'The product must be accompanied by the original sales invoice for returns or exchanges. It must be unused and unopened, with all original packaging materials, parts, accessories, manuals, registration cards, free-of-cost (FOC) bundled products, and promotional vouchers.'
            },
            {
              heading: 'Returns and Exchanges Not Applicable:',
              text: '• If the packaging is incomplete or the product is damaged or scratched. \n• For customized or special-order products, cut cables or wires, apparel, personal care, and hygiene products.\n• If the online activation code is scratched or redeemed.\n• If VAT has been refunded against the invoice.'
            },
            {
              heading: 'Restocking Fees:',
              text: 'If the packaging is soiled or opened and the product is not defective, unused, or has no visible scratches, the product will be accepted back with a minimum restocking fee of 15% or as per applicable criteria. For major units/devices and medium home appliances and large panels, parts, electric / electronics devices, restocking fees will be determined after a review by the authorized service partner.\n\nReturns for Major/Medium Home Appliances/ Electrical & Electronics Devices Audio/Video Products:\nReturns or exchanges will be based on the investigation report and approval from the manufacturer’s authorized service center.'
            },
            {
              heading: 'Handling Charges for Returns:',
              text: 'For customers who accept supplier delivery and request a return within 7 days of purchase, handling charges will apply.'
            },
            {
              heading: 'Dead on Arrival (DOA) or Non-Functioning Products:',
              text: 'Products that arrive dead on arrival or are not functioning as per the manual will be exchanged or returned after verification by Fajtradingllc.com personnel or the manufacturer’s authorized service center. This process may take up to four business days.'
            },
            {
              heading: 'Important Data and Information:',
              text: 'Fajtradingllc.com is not responsible for transferring any data from returned products or for any loss of data stored on those products.'
            },
             {
              heading: 'Refunds:',
              text: 'Refunds for products purchased with credit or debit cards will be processed back to the same card used for the transaction.\nRefunds for purchases made using gift cards or loyalty points will be issued as a Fajtradingllc.com card.\nRefunds will be processed within 7 to 14 business days after the return process is completed.'
            },
            {
              heading: 'Non-Refundable Charges:',
              text: 'Service, delivery, and installation charges are non-refundable once acknowledged by the customer.\nProcessing fees, any services provided, delivery, and installation charges are non-refundable once acknowledged by the customer. '
            },
            
          ]
        };

      case 'terms':
        return {
          sections: [
            {
              heading: 'Introduction',
              text: 'Welcome to fajtradingllc.com, a service provided by F A J Trading LLC. By using the fajtradingllc.com service, you agree to accept the following terms and conditions.All products, services, and information displayed on fajtradingllc.com constitute an “invitation to offer.” Your order for purchase represents your “offer,” which will be subject to these terms and conditions. F A J Trading LLC reserves the right to accept or reject your offer.If you provide us with a valid email address, we will notify you by email as soon as possible to confirm receipt of your order. We will email you again to confirm the details and process your order. Our acceptance of your order occurs upon the dispatch of the product(s) you ordered. Please note that no act or omission by fajtradingllc.com prior to the actual dispatch of the product(s) will constitute acceptance of your offer.'
            },
            {
              heading: 'Pricing Information',
              text: 'At fajtradingllc.com, we strive to provide accurate product and pricing information. However, pricing or typographical errors may occasionally occur. We cannot confirm the price of a product until after you place your order. If a product is listed at an incorrect price or with inaccurate information due to an error, fajtradingllc.com reserves the right, at our sole discretion, to refuse or cancel any orders for that product unless the item has already been dispatched.If an item is mispriced, we may either contact you for further instructions or cancel your order and notify you of the cancellation. Your offer will not be considered accepted until the product you ordered has been dispatched. We also reserve the right to modify the products price and reach out to you using the email address you provided during registration, or cancel the order and inform you of such cancellation.Once your order is accepted, the payment will be charged to your credit card, and you will receive an email confirmation that the payment has been processed. Please note that payment may be processed before we dispatch your ordered product. If we need to cancel your order after processing the payment, the amount will be reversed back to your credit card. Under no circumstances will cash disbursements be made.We aim to offer you the best prices possible at fajtradingllc.com and in  F A J Trading LLC store. However, prices may differ between our online platform and physical store to ensure we remain the lowest price provider in your geographic region. Additionally, prices and availability are subject to change without prior notice.'
            },
            {
              heading: 'Delivery',
              text: 'Orders within the UAE are usually delivered within 2 to 5 business days. However, for larger items such as refrigerators, air conditioners, kitchen equipment (50 inches and above), commercial espresso machines, and other major products, delivery may take 5 to 7 business days.Deliveries outside city limits may incur additional charges, which will depend on the category of the product.'
            },
            {
              heading: 'Express Delivery',
              text: 'Express Delivery is available for customers who need quicker delivery, typically within 24 hours for orders placed within the city limits of Dubai and Sharjah. This service is offered for select products only, which are marked with an Express Delivery badge on our website.F A J Members can benefit from free Express Delivery on applicable products. The customers can filter for eligible products using the Express Delivery filter.Place your order before 12 noon, and with “Express Delivery,” you will receive it the same day if you are in Dubai or Sharjah'
            },
            {
              heading: 'Account and Registration Obligations',
              text: '"Your Information" refers to any details you provide to us during the registration, purchasing, or listing process, in the feedback section, or through any email features. We will protect Your Information in accordance with our Privacy Policy. By using the Site, you are responsible for keeping your Account and Password confidential and for restricting access to your computer. You agree to take responsibility for all activities that occur under your Account or Password. fajtradingllc.com is not liable for any loss or damage that may result from your failure to protect your password or account. If you know or suspect that someone else knows your password, please notify us immediately using the address provided below. If we believe there may be a security breach or misuse of the fajtradingllc.com Site, we may require you to change your password or suspend your account without any liability to fajtradingllc.com.'
            },
            {
              heading: 'Additionally, you agree to:',
              text: 'Provide true, accurate, current, and complete information about yourself as prompted by the F A J Trading LLC registration form (this information will be referred to as "Registration Data").Maintain and promptly update your Registration Data to ensure it remains true, accurate, current, and complete.If you provide any information that is untrue, inaccurate, incomplete, or not current, or if fajtradingllc.com has reasonable grounds to suspect that such information is untrue or inaccurate, we reserve the right to indefinitely suspend or terminate your membership and deny you access to the Site.'
            },
            {
              heading: 'Return and Exchange Policy',
              text: 'At Fajtradingllc.com, your satisfaction is our priority. If you are not satisfied with your purchase, we will accept returns of products within seven (7) days from the date of collection or delivery. Please review the following terms and conditions for returns and exchanges:'
            },
            {
              heading: 'Contact Information:',
              text: 'Customers can reach us by calling 971507063378, emailing us at sales@fajtradingllc.com, or contacting us via WhatsApp at +971507063378.'
            },
            {
              heading: 'Returns and Exchanges:',
            },
            {
              heading: 'Accessories and Personal Care Items:',
              text: 'Returns are accepted if the product is sealed and packed or if it has a manufacturing defect upon opening. No returns are accepted for opened products in good working condition.'
            },
             {
              heading: 'Hard Goods:',
              text: 'The product must be in the same condition as when received (unopened, with the original packaging, including accessories, user manuals, warranty cards, and brand seals). For IT and telecom products, no returns are allowed once activated by the customer.'
            },
            {
              heading: 'Unopened Online Purchases:',
              text: 'Returns and refunds do not apply to unopened online purchases. For opened items, returns are allowed but a restocking fee will apply. If you wish to receive unopened units, you must sign an acknowledgment releasing Fajtradingllc.com from any further claims.'
            },
            {
              heading: 'Required Documentation:',
              text: 'The product must be accompanied by the original sales invoice for returns or exchanges. It must be unused and unopened, with all original packaging materials, parts, accessories, manuals, registration cards, free-of-cost (FOC) bundled products, and promotional vouchers.'
            },
            {
              heading: 'Returns and Exchanges Not Applicable:',
              text: 'If the packaging is incomplete or the product is damaged or scratched. For customized or special-order products, cut cables or wires, apparel, personal care, and hygiene products. If the online activation code is scratched or redeemed. If VAT has been refunded against the invoice.'
            },
            {
              heading: 'Restocking Fees:',
              text: 'If the packaging is soiled or opened and the product is not defective, unused, or has no visible scratches, the product will be accepted back with a minimum restocking fee of 15% or as per applicable criteria. For major units/devices and medium home appliances and large panels, parts, electric / electronics devices, restocking fees will be determined after a review by the authorized service partner.Returns for Major/Medium Home Appliances/ Electrical & Electronics Devices Audio/Video Products:Returns or exchanges will be based on the investigation report and approval from the manufacturer’s authorized service center.'
            },
            {
              heading: 'Handling Charges for Returns:',
              text: 'For customers who accept supplier delivery and request a return within 7 days of purchase, handling charges will apply.'
            },
            {
              heading: 'Dead on Arrival (DOA) or Non-Functioning Products:',
              text: 'Products that arrive dead on arrival or are not functioning as per the manual will be exchanged or returned after verification by Fajtradingllc.com personnel or the manufacturer’s authorized service center. This process may take up to four business days.'
            },
            {
              heading: 'Important Data and Information:',
              text: 'Fajtradingllc.com is not responsible for transferring any data from returned products or for any loss of data stored on those products.'
            },
            {
              heading: 'Refunds:',
              text: 'Refunds for products purchased with credit or debit cards will be processed back to the same card used for the transaction.Refunds for purchases made using gift cards or loyalty points will be issued as a Fajtradingllc.com card.Refunds will be processed within 7 to 14 business days after the return process is completed.'
            },
            {
              heading: 'Non-Refundable Charges:',
              text: 'Service, delivery, and installation charges are non-refundable once acknowledged by the customer.Processing fees, any services provided, delivery, and installation charges are non-refundable once acknowledged by the customer. '
            },
            {
              heading: 'Inspection:',
              text: 'Customers should inspect products carefully before signing the Proof of Delivery (POD). Any product reported damaged after signing the POD will not qualify for returns or warranty claims.'
            },
            {
              heading: 'Extended Warranty/Damage Protection Plans:',
              text: 'These can be returned if the product is returned within the manufacturers warranty period. The decision of store management is final.'
            },
            {
              heading: 'Cancellation Policy for Fajtradingllc.com',
              text: 'Please be aware that there may be certain orders we are unable to accept and may need to cancel. We reserve the right, at our discretion, to refuse or cancel any order for any reason. Some situations that could lead to the cancellation of your order include: \n\n Limitations on quantities available for purchase.\n\n Inaccuracies or errors in product or pricing information. \n\n Issues identified by our credit and fraud prevention department. \n\n Instances where we suspect the customer is manipulating their account to place multiple orders \n\n We may also require additional verification or information before processing your order. If all or any part / product of your order is cancelled, or if we need additional information to accept your order, we will contact you.\n\n In the event your order is cancelled after your credit card has been charged, the amount will be refunded to your same credit card account. Please note that no cash disbursements will be made under any circumstances.'
            },
            {
              heading: 'Quality Check',
              text: 'In order to ensure top quality customer experience, we do a quality check on orders dispatched at our end. If we find any fault in the product(s) in your order, we reserve the right to cancel the order partially or fully. On such cases, we shall notify you about the same.'
            },
            {
              heading: 'Cancellations by the Customer',
              text: 'In case we receive a cancellation notice and the order has not been processed/approved by us, we shall cancel the order and refund the entire amount. We will not be able to cancel orders that have already been processed and shipped out by us. Fajtradingllc.com has the full right to decide whether an order has been processed or not. The customer agrees not to dispute the decision made by Fajtradingllc.com and accept Fajtradingllc.com’s decision regarding the cancellation.'
            },
            {
              heading: 'Cancellations By Seller',
              text: 'In case the seller is unable to fulfil the order due to stock unavailability, F A J Trading LLC Customer Care will connect with the customer & assist with alternatives.'
            },
            {
              heading: 'Credit Card Details',
              text: 'You agree, understand and confirm that the credit card details provided by you for availing of services on Fajtradingllc.com will be correct and accurate and you shall not use the credit card which is not lawfully owned by you, i.e. in a credit card transaction, you must use your own credit card. You further agree and undertake to provide the correct and valid credit card details to Fajtradingllc.com. Further the said information will not be utilized and shared by Fajtradingllc.com with any of the third parties unless required for fraud verifications or by law, regulation or court order. Fajtradingllc.com will not be liable for any credit card fraud. The liability for use of a card fraudulently will be on you and the onus to ‘prove otherwise’ shall be exclusively on you.'
            },
            {
              heading: 'Fraudulent or Declined Transactions',
              text: 'Fajtradingllc.com reserves the right to recover costs associated with goods, collection charges, and legal fees from individuals who utilise the site fraudulently. We also reserve the right to initiate legal proceedings against anyone engaged in fraudulent activities on the site or any unlawful acts that breach these terms and conditions.'
            },
            {
              heading: 'Transactional Restrictions',
              text: 'Orders will not be processed if any of the following events occur. Customers may request a refund in cases where money has been deducted from their accounts; however, please note that the order will not be fulfilled under any circumstances. \n\n. Cards issued outside of the GCC (Gulf Cooperation Council) and Egypt are not accepted./n/n. A maximum of two attempts per day is allowed. \n\n. A maximum of two transactions per day is permitted. \n\n. Unauthorized use of any credit or debit card is prohibited.'
            },
            {
              heading: 'Electronic Communications',
              text: 'When you visit the Site or send emails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by email or by posting notices on the Site. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.'
            },
            {
              heading: 'You Agree and Confirm',
              text: 'That in the event that a non-delivery occurs on account of a mistake by you (i.e. wrong name or address or any other wrong information) any extra cost incurred by Fajtradingllc.com for redelivery shall be claimed from you.\n\n That you will use the services provided by Fajtradingllc.com, its affiliates, consultants and contracted companies, for lawful purposes only and comply with all applicable laws and regulations while using the Site and transacting on the Site. \n\n You will provide authentic and true information in all instances where such information is requested of you. Fajtradingllc.com reserves the right to confirm and validate the information and other details provided by you at any point of time. If upon confirmation your details are found not to be true (wholly or partly), Fajtradingllc.com has the right in its sole discretion to reject the registration and debar you from using the Services of Fajtradingllc.com and / or other affiliated websites without prior intimation whatsoever. \n\n That you are accessing the services available on this Site and transacting at your sole risk and are using your best and prudent judgment before entering into any transaction through this Site \n\n That the address at which delivery of the product ordered by you is to be made will be correct and proper in all respects.'
            },
            {
              heading: 'You may not use the Site/ mobile app for any of the following purposes:',
              text: 'Disseminating any unlawful, harassing, libelous, abusive, threatening, harmful, vulgar, obscene, or otherwise objectionable material. \n\n Transmitting material that encourages conduct that constitutes a criminal offence results in civil liability or otherwise breaches any relevant laws, regulations or code of practice. \n\n Gaining unauthorized access to other computer systems. \n\n Interfering with any other person’s use or enjoyment of the Site. \n\n Breaching any applicable laws \n\n Interfering or disrupting networks or web sites connected to the Site.\n\n Making, transmitting or storing electronic copies of materials protected by copyright without the permission of the owner. \n\n We have made every effort to display the colors of our products that appear on the Site as accurately as possible. However, as the actual colors you see will depend on your monitor, we cannot guarantee that your monitor’s display of any color will be accurate. Shipping'
            },
            {
              heading: 'Shipping costs are based on a combination of the following:',
              text: 'Weight and dimensions of package.\n\n Method of shipment such as Ground, Air, Ship, Rail etc. \n\n The location you are shipping from (city, state, country) \n\n The location you are shipping to (also called the destination country) \n\n Costs can be considerably higher for international destinations. Generally, buyers pay additional costs such as duties, taxes, and customs clearance fees. For example, international rates may or may not include pickup and door-to-door delivery with customs clearance. An “extended area surcharge” may apply to buyers depending on their international locations.'
            },
            {
              heading: 'Cash on Delivery Terms and Conditions',
            },
            {
              heading: 'General Terms:',
              text: 'Cash on Delivery (COD) is available as a payment method for products sold by F A J Trading LLC and select sellers. \n\n. In addition to any shipping charges, customers are required to pay a non-refundable convenience charge of AED 80 when choosing the cash-on-delivery payment method. \n\n. The maximum limit for orders placed using the COD payment method is AED 5,000. \n\n. After selecting Cash on Delivery, customers will receive an massage or automated call to confirm their order. The order will be on hold for the next 6 hours until the customer confirms it. If the order is not confirmed within this timeframe, it will be automatically cancelled, and the customer will be notified.\n\n. Our designated courier partner will contact the customer to provide a scheduled time range on the delivery day for delivering the order and collecting payment.\n\n. If the order cannot be delivered (after reasonable attempts by the courier), it will be cancelled, and the order will be returned to F A J Trading LLC. Customers are allowed to reschedule the delivery only once, within a maximum of two (2) business days.\n\n. The customer must pay the exact order amount in cash upon delivery. The courier will not accept any other payment methods.\n\n. Any eligible refunds will be processed as an online gift card to the customers account with F A J Trading LLC. This gift card can be used for any online purchases. \n\n. Customers should check the product for any signs of tampering before accepting it. However, customers are not permitted to open the package until payment has been completed. \n\n. Once payment has been made to the courier and the order has been handed over to the customer, the delivery process is considered complete. If there are any issues with the order, please contact us at +971 50 706 3378, email us at info@fajtradingllc.com, or visit the F A J Trading LLC store for assistance.'
            },
          ]
        };

      case 'bulk':
        return {
          sections: [
            {
              text: 'Choose from a wide range of brands in coffee machines, coffee machine equipment, appliances, air conditioning, communications parts, and electrical/electronic devices, all at competitive prices. We provide high-quality products supported by a strong after-sales service network. If you’re considering innovative corporate, please fill in the details below, and let us assist you in making a purchase. Simply send us an email with your company’s contact information and the products you are interested in, and we will respond as soon as possible. \n\n Coffee Machines & Coffee Machines Equipment \n\n Appliances \n\n Air Conditioning \n\n Electrical Components \n\n Electronics Devices \n\n Home & Kitchen \n\n Health & Fitness \n\n Water Heaters \n\n Solar \n\n Get all your favorite products today in our convenient destination!'
            },
            {
              heading: 'WELCOME TO THE HUB OF BULK ORDERS',
              text: 'At F A J Trading LLC, we proudly serve a diverse range of products to thousands of customers worldwide and are renowned for handling bulk orders seamlessly. We aim to simplify the payment process for our customers by offering easy payment methods. **How Do Bulk Orders & Enquiries Work? \n\n Follow these simple steps to streamline your shopping experience with F A J Trading LLC.'
            },
            {
              heading: 'Centralized Platform for Everything',
              text: 'Using our one-stop platform, you can easily place bulk orders. Our customer support team will reach out to discuss further details with you.'
            },
            {
              heading: 'Tailored Needs',
              text: 'Customize your purchasing process based on your organizations requirements. This will help you navigate through products efficiently. Once your order is confirmed, you can finalize your quote and secure the deal.'
            },
            {
              heading: 'Automated Tracking',
              text: 'After confirming your order, you can make your payment online. Automated tracking and updates will be sent to you, including order status, delivery notifications, and unboxing status from our team.'
            },
          ]
        };

      default:
        return {
          sections: [
            {
              heading: 'Information',
              text: 'Content not available.'
            }
          ]
        };
    }
  };

  const pageContent = getContent();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#232F3E" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.pageTitle}>{title}</Text>
          <Text style={styles.lastUpdated}>Last Updated: October 13, 2025</Text>

          {pageContent.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionHeading}>{section.heading}</Text>
              <Text style={styles.sectionText}>{section.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#232F3E',
    borderBottomWidth: 1,
    borderBottomColor: '#1A252F',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232F3E',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 13,
    color: '#999',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232F3E',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
});

export default StaticPageScreen;