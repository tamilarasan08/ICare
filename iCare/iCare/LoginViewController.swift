//
//  LoginViewController.swift
//  iCare
//
//  Created by Aishwarya on 09/12/15.
//  Copyright (c) 2015 Aishwarya. All rights reserved.
//

import UIKit


let loginRequestURL=""
let signUpURL=""

class LoginViewController: UIViewController {

    @IBOutlet weak var userNameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var isAdminSwitch: UISwitch!
    @IBAction func loginButtonAction(sender: UIButton) {
        var userName=userNameTextField.text;
        var password=passwordTextField.text;
        var isAdmin=isAdminSwitch.on;
        var nl:NetworkLayer=NetworkLayer()
        var returnData:NSData=nl.connectToURL(loginRequestURL, postBody:["user_name":userName,"password":password,"isAdmin":isAdmin])
        var error:NSError? = nil
        if let jsonObject: AnyObject = NSJSONSerialization.JSONObjectWithData(returnData, options: nil, error:&error) {
            if let dict = jsonObject as? NSDictionary {
                println(dict)
                var status: String?=dict.objectForKey("status") as? String
                if (status=="success")
                {
                    println("show admin screen")
                }
                else
                {
                    println("show donator screen")
                }
                
            }
        } else {
            println("Could not parse JSON: \(error!)")
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


}

