//
//  NetworkLayer.swift
//  iCare
//
//  Created by Aishwarya on 10/12/15.
//  Copyright (c) 2015 Aishwarya. All rights reserved.
//

import Foundation
import MobileCoreServices
import UIKit

class NetworkLayer: NSObject
{
    func connectToURL(urlPath:NSString, postBody:Dictionary<String,String>,multipartFiles:Dictionary<NSURL,NSData!>!) ->NSData?
    {
        
        let url: NSURL = NSURL(string: urlPath as String)!
        var request: NSMutableURLRequest = NSMutableURLRequest(URL: url)
        var postData:NSData;
        let boundary = generateBoundaryString()
        var error: NSError?
        if(multipartFiles.count>0)
        {
            
            request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
            postData=getHttpData(postBody, multipartFiles: multipartFiles, boundary: boundary)
            
        }
        else
        {
            postData=NSJSONSerialization.dataWithJSONObject(postBody, options:  NSJSONWritingOptions(rawValue:0), error: &error)!
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        
        request.HTTPBody=postData
        
        println("URL :\(request.URL)");
        println("Header :\(request.allHTTPHeaderFields)")
        println("Body :\(NSString(data: request.HTTPBody!, encoding: NSUTF8StringEncoding))")
        request.HTTPMethod = "POST"
        
        var response: NSURLResponse?
        
        let urlData = NSURLConnection.sendSynchronousRequest(request, returningResponse: &response, error: &error)
        if error == nil
        {
            if let httpResponse = response as? NSHTTPURLResponse {
                println(httpResponse.statusCode)
            }
            return urlData!;
        }
        else
        {
            return nil;
        }
    }
    

    func generateBoundaryString() -> String {
        return "Boundary-\(NSUUID().UUIDString)"
    }   

    
    func mimeTypeForPath(path: String) -> String {
        let url = NSURL(fileURLWithPath: path)
        let pathExtension = url?.pathExtension
        
        if let uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, pathExtension! as NSString, nil)?.takeRetainedValue() {
            if let mimetype = UTTypeCopyPreferredTagWithClass(uti, kUTTagClassMIMEType)?.takeRetainedValue() {
                return mimetype as String
            }
        }
        return "application/octet-stream";
    }
    
    
    func appendString(string: String,data:NSMutableData) ->NSMutableData{
        let stringData = string.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        data.appendData(stringData!)
        return data
    }
    
    
    func getHttpData(jsonData:NSDictionary,multipartFiles:Dictionary<NSURL,NSData!>, boundary:String)->NSData
    {
        

        var error:NSError?
        var httpBody:NSMutableData=NSMutableData()
        
        // process the dictionary
        
        for (key, value) in jsonData {
            httpBody=appendString("--\(boundary)\r\n",data:httpBody)
            httpBody=appendString("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n",data:httpBody)
            httpBody=appendString("\(value)\r\n",data:httpBody)
        }

        
        for (key,path) in multipartFiles
        {
            if (path != nil)
            {
                let filename = key.lastPathComponent
                var mimetype = mimeTypeForPath(key.path!)
                httpBody=appendString("\(boundary)\r\n",data: httpBody)
                httpBody=appendString("Content-Disposition: form-data; name=\"\(key)\";filename=\(filename)\"\r\n\r\n",data: httpBody)
                httpBody=appendString("Content-Type: \(mimetype)\r\n\r\n",data:httpBody)
                httpBody.appendData(path)
                httpBody=appendString("\r\n",data:httpBody)
            }
            
        }
        
        httpBody=appendString("--\(boundary)--\r\n",data:httpBody)
        return httpBody;
    }

    
}







