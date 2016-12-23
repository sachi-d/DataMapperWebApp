/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var xmlTrial = '<?xml version= "1.0"?><catalog> <book > <author>Gambardella, Matthew</author> <title>XML Developer\'s Guide</title> <genre>Computer</genre><price>44.95</price> <publish_date>2000-10-01</publish_date> <description>An in-depth look at creating applications with XML.</description> </book>   <book >  <author>Ralls, Kim</author>  <title>Midnight Rain</title>  <genre>Fantasy</genre> <price>5.95</price> <publish_date>2000-12-16</publish_date><description>A former architect battles corporate zombies, an evil sorceress, and her own childhood to become queen of the world.</description></book></catalog>';

var xsdTrial = '<?xml version="1.0"?> <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.w3schools.com" xmlns="http://www.w3schools.com" elementFormDefault="qualified"><xs:element name="note"> <xs:complexType> <xs:sequence><xs:element name="to" type="xs:string" /> <xs:element name="from" type="xs:string" />  <xs:element name="heading" type="xs:string" />     <xs:element name="body" type="xs:string" /> </xs:sequence>   </xs:complexType></xs:element></xs:schema>';

var xsd2 = '<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://tempuri.org/PurchaseOrderSchema.xsd" targetNamespace="http://tempuri.org/PurchaseOrderSchema.xsd" elementFormDefault="qualified"><xsd:element name="PurchaseOrder" type="tns:PurchaseOrderType"></xsd:element><xsd:complexType name="PurchaseOrderType"> <xsd:sequence>  <xsd:element name="ShipTo" type="tns:USAddress" maxOccurs="2"></xsd:element>  <xsd:element name="BillTo" type="tns:USAddress"></xsd:element> </xsd:sequence> <xsd:attribute name="OrderDate" type="xsd:date"></xsd:attribute> </xsd:complexType><xsd:complexType name="USAddress"><xsd:sequence> <xsd:element name="name" type="xsd:string"></xsd:element><xsd:element name="street" type="xsd:string"></xsd:element><xsd:element name="city" type="xsd:string"></xsd:element><xsd:element name="state" type="xsd:string"></xsd:element><xsd:element name="zip" type="xsd:integer"></xsd:element></xsd:sequence><xsd:attribute name="country" type="xsd:NMTOKEN" fixed="US"></xsd:attribute></xsd:complexType></xsd:schema>';

//traverse XML tree
function traverseTree(rootNode) {
    //    if (rootNode.nodeType !== Node.ELEMENT_NODE) {
    //        return;
    //    }
    var children = rootNode.children;

    if (children.length == 0) {
        console.log("child-" + rootNode.nodeName);

    } else {
        console.log("parent-" + rootNode.nodeName);
    }
    //    $("#" + resultBox).append(nodeName);
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        console.log(child);
        traverseTree(child);

    }
}

//parse XML tree
function parseXMLTree(inputText) {
    parser = new DOMParser();


    var xmlDoc = parser.parseFromString(inputText, "text/xml");
    //    console.log(xmlDoc);
    // documentElement always represents the root node
    var root = xmlDoc.documentElement;
    traverseTree(root);

}

parseXMLTree(xsd2);