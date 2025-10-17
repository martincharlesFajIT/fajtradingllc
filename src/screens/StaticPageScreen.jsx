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
              heading: 'Agreement to Terms',
              text: 'By accessing and using the FAJ Trading LLC mobile application, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our application.'
            },
            {
              heading: 'Use of Application',
              text: 'You agree to use our application only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the application.\n\nYou must not:\n• Use the application in any unlawful manner\n• Attempt to gain unauthorized access\n• Transmit viruses or malicious code\n• Collect data from the application without permission\n• Impersonate another person or entity'
            },
            {
              heading: 'User Accounts',
              text: 'When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:\n\n• Maintaining the confidentiality of your account\n• All activities that occur under your account\n• Notifying us immediately of any unauthorized use\n\nWe reserve the right to suspend or terminate your account if you violate these terms.'
            },
            {
              heading: 'Orders and Payments',
              text: 'All orders are subject to acceptance and availability. We reserve the right to refuse any order. Prices are subject to change without notice.\n\nPayment must be received before your order is processed. We accept the following payment methods:\n• Credit/Debit Cards\n• Digital Wallets\n• Cash on Delivery (where available)\n\nBy placing an order, you warrant that you are legally capable of entering into binding contracts.'
            },
            {
              heading: 'Intellectual Property',
              text: 'The application and its original content, features, and functionality are owned by FAJ Trading LLC and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.\n\nYou may not reproduce, distribute, modify, or create derivative works without our express written permission.'
            },
            {
              heading: 'Limitation of Liability',
              text: 'FAJ Trading LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:\n\n• Your use or inability to use the application\n• Unauthorized access to your data\n• Errors or omissions in content\n• Any other matter relating to the application\n\nOur total liability shall not exceed the amount paid by you for products purchased through our application.'
            },
            {
              heading: 'Governing Law',
              text: 'These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions.\n\nAny disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of Dubai, UAE.'
            },
            {
              heading: 'Changes to Terms',
              text: 'We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page.\n\nYour continued use of the application after changes are posted constitutes acceptance of the new Terms.'
            },
            {
              heading: 'Contact Us',
              text: 'If you have any questions about these Terms and Conditions, please contact us:\n\nEmail: legal@fajtradingllc.com\nPhone: +971-XX-XXX-XXXX\nAddress: Dubai, United Arab Emirates'
            }
          ]
        };

      case 'bulk':
        return {
          sections: [
            {
              heading: 'Welcome to Bulk Orders',
              text: 'Thank you for your interest in bulk orders with FAJ Trading LLC. We specialize in providing high-quality products at competitive prices for businesses, organizations, and individuals requiring large quantities.'
            },
            {
              heading: 'Benefits of Bulk Ordering',
              text: 'When you order in bulk from us, you enjoy:\n\n• Significant volume discounts\n• Priority customer service\n• Flexible payment terms\n• Customized delivery schedules\n• Dedicated account manager\n• Exclusive access to wholesale pricing\n• Custom packaging options (for large orders)'
            },
            {
              heading: 'Minimum Order Quantities',
              text: 'Our bulk order minimums vary by product category:\n\n• Electronics: Minimum 50 units\n• Home & Kitchen: Minimum 100 units\n• Fashion & Accessories: Minimum 200 units\n• Beauty Products: Minimum 100 units\n• Sports & Outdoors: Minimum 75 units\n\nFor specific product minimums, please contact our bulk orders team.'
            },
            {
              heading: 'Pricing and Discounts',
              text: 'Our bulk pricing structure offers increasing discounts based on order volume:\n\n• 50-99 units: 10% discount\n• 100-249 units: 15% discount\n• 250-499 units: 20% discount\n• 500-999 units: 25% discount\n• 1000+ units: 30% discount (custom quote)\n\nPrices are subject to market conditions and product availability. Contact us for a detailed quote.'
            },
            {
              heading: 'How to Place a Bulk Order',
              text: 'Follow these simple steps to place your bulk order:\n\n1. Contact our bulk orders team via email or phone\n2. Provide details about the products and quantities needed\n3. Receive a customized quote within 24-48 hours\n4. Review and approve the quote\n5. Arrange payment (various payment terms available)\n6. Confirm delivery schedule\n7. Receive your order\n\nWe work closely with you throughout the entire process to ensure a smooth experience.'
            },
            {
              heading: 'Payment Terms',
              text: 'We offer flexible payment options for bulk orders:\n\n• Full payment upfront (additional 2% discount)\n• 50% deposit, 50% before delivery\n• Net 30 payment terms (for approved accounts)\n• Letter of Credit (for international orders)\n• Purchase Orders from registered businesses\n\nCredit applications are reviewed within 3-5 business days.'
            },
            {
              heading: 'Delivery and Logistics',
              text: 'We understand that timely delivery is crucial for your business:\n\n• Standard delivery: 7-14 business days\n• Express delivery: 3-5 business days (additional fee)\n• Custom delivery schedules available\n• Tracking provided for all orders\n• Multiple delivery locations supported\n• White-glove delivery service available\n\nShipping costs vary based on order size, weight, and destination.'
            },
            {
              heading: 'Quality Assurance',
              text: 'All bulk orders undergo rigorous quality control:\n\n• Pre-shipment inspection\n• Quality certificates provided\n• Product samples available before bulk order\n• Warranty coverage on all products\n• Easy returns process for defective items\n\nWe stand behind the quality of our products 100%.'
            },
            {
              heading: 'Custom Solutions',
              text: 'For large or unique orders, we can provide:\n\n• Custom branding and packaging\n• Product customization\n• Private labeling\n• Exclusive product sourcing\n• Import/export assistance\n• Inventory management solutions\n\nContact us to discuss your specific requirements.'
            },
            {
              heading: 'Industries We Serve',
              text: 'We work with clients across various industries:\n\n• Retail Stores and Chains\n• E-commerce Businesses\n• Corporate Gifting Companies\n• Event Planners and Organizers\n• Hotels and Hospitality\n• Educational Institutions\n• Government Agencies\n• NGOs and Charities\n• And many more!'
            },
            {
              heading: 'Contact Our Bulk Orders Team',
              text: 'Ready to place your bulk order? Get in touch with us:\n\n📧 Email: bulk@fajtradingllc.com\n📞 Phone: +971-XX-XXX-XXXX\n📱 WhatsApp: +971-XX-XXX-XXXX\n🕒 Hours: Sunday - Thursday, 9:00 AM - 6:00 PM GST\n\nOur team is here to help you save money and streamline your procurement process. We look forward to serving your bulk order needs!'
            },
            {
              heading: 'Request a Quote',
              text: 'To request a quote, please provide:\n\n• Your company name and contact information\n• List of products and quantities needed\n• Preferred delivery timeline\n• Delivery location\n• Any special requirements\n\nWe will respond with a detailed quote within 24-48 hours. For urgent requests, please call us directly.'
            }
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