//
//  NetworkLayer.swift
//  iCare
//
//  Created by Aishwarya on 10/12/15.
//  Copyright (c) 2015 Aishwarya. All rights reserved.
//

import Foundation
import MobileCoreServices


class NetworkLayer: NSObject
{
    func connectToURL(urlPath:NSString, postBody:NSDictionary) ->NSData
    {
        
        let url: NSURL = NSURL(string: urlPath as String)!
        var request: NSMutableURLRequest = NSMutableURLRequest(URL: url)
        var postData:NSData=NSKeyedArchiver.archivedDataWithRootObject(postBody)
        request.HTTPBody=postData
        request.HTTPMethod = "POST"
        var response: NSURLResponse?
        var error: NSError?
        let urlData = NSURLConnection.sendSynchronousRequest(request, returningResponse: &response, error: &error)
        if let httpResponse = response as? NSHTTPURLResponse {
            println(httpResponse.statusCode)
        }
        return urlData!;
    }
    
    func generateBoundaryString() -> String {
        return "Boundary-\(NSUUID().UUIDString)"
    }
    
    func appendString(string: String,data:NSMutableData) ->NSMutableData{
        let stringData = string.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        data.appendData(stringData!)
        return data
    }
    
    func connectToURLWithMultipartData(urlPath:NSString, jsonData:NSDictionary,multipartFiles:NSDictionary)->NSData
    {
        
        var boundary=generateBoundaryString()
        
        var httpBody:NSMutableData=NSMutableData()
        
        // process the dictionary
        
        for(key,value) in jsonData
        {
            httpBody=appendString("--\"\(boundary)\"\r\n",data: httpBody)
            httpBody=appendString("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n",data: httpBody)
            httpBody=appendString("\(value)\r\n",data:httpBody)
            httpBody=appendString("\r\n",data:httpBody)
            
        }
        
        // process image data

        for (key,path) in multipartFiles
        {
            let url:NSURL = NSURL(fileURLWithPath: path as String)!
            let filename = url.lastPathComponent
            let data = NSData(contentsOfURL: url)!
            let mimetype = mimeTypeForPath(path as String)
            httpBody=appendString("--\"\(boundary)\"\r\n",data: httpBody)
            httpBody=appendString("Content-Disposition: form-data; name=\"\(key)\"filename=\(filename)\"\r\n\r\n",data: httpBody)
            httpBody=appendString("Content-Type: \(mimetype)\r\n\r\n",data:httpBody)
            httpBody=appendString("\(data)\r\n",data:httpBody)
            httpBody=appendString("\r\n",data:httpBody)


        }
        httpBody=appendString("--\"\(boundary)--\r\n",data:httpBody)
        
        return httpBody;
    }
    func mimeTypeForPath(path: String) -> String
    {
        let url:NSURL = NSURL(fileURLWithPath: path)!
        let pathExtension = url.pathExtension
        
        if let uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, pathExtension! as NSString, nil)?.takeRetainedValue() {
            if let mimetype = UTTypeCopyPreferredTagWithClass(uti, kUTTagClassMIMEType)?.takeRetainedValue() {
                return mimetype as String
            }
        }
        return "application/octet-stream";
    }
}







