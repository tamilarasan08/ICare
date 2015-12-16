//
//  LoginViewController.swift
//  iCare
//
//  Created by Aishwarya on 09/12/15.
//  Copyright (c) 2015 Aishwarya. All rights reserved.
//

import UIKit


let loginRequestURL="http://localhost:8084/loginUser"
let signUpURL="http://localhost:8084/createUser"

class LoginViewController: UIViewController {

    @IBOutlet weak var userNameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var isAdminSwitch: UISwitch!
    @IBAction func loginButtonAction(sender: UIButton) {
        var userName=userNameTextField.text;
        var password=passwordTextField.text;
        var isAdmin=isAdminSwitch.on;
        var nl:NetworkLayer=NetworkLayer()
        var category:NSString;
        if isAdmin
        {
          category="admin";
        }
        else
        {
            category="user"
        }
        var returnData:NSData!=nl.connectToURL(loginRequestURL, postBody:["name":userName,"password":password,"category":category],multipartFiles:[NSURL: NSData]())!
        if((returnData) != nil)
        {
        var error:NSError? = nil
        if let jsonObject: AnyObject = NSJSONSerialization.JSONObjectWithData(returnData, options: nil, error:&error) {
            if let dict = jsonObject as? NSDictionary {
                println(dict)
                var error_code: NSNumber?=dict.objectForKey("error_code") as? NSNumber
                var message:NSString=dict.objectForKey("error_message") as NSString;
                if (error_code?.integerValue==0)
                {
                    if(isAdmin)
                    {
                        println("show admin screen")
                    }
                    else
                    {
                        println("show donator screen")
                    }
                    
                }
                else
                {
                    var alert:UIAlertView=UIAlertView(title: "Error", message:message , delegate: nil, cancelButtonTitle: "OK")
                    alert.show()
                }
            }
        } else {
            println("Could not parse JSON: \(error!)")
        }
        }
        else
        {
            var alert:UIAlertView=UIAlertView(title: "Error", message:"Error while connecting to service" , delegate: nil, cancelButtonTitle: "OK")
            alert.show()

        }
        
        
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    override func touchesBegan(touches: NSSet, withEvent event: UIEvent?){
        view.endEditing(true)
        super.touchesBegan(touches, withEvent: event!)
    }

}

