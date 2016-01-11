//
//  LoginViewController.swift
//  iCare
//
//  Created by Aishwarya on 09/12/15.
//  Copyright (c) 2015 Aishwarya. All rights reserved.
//

import UIKit




class SignUpViewController: UIViewController ,UIImagePickerControllerDelegate,UINavigationControllerDelegate{
    
    @IBOutlet weak var userNameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var confirmPasswordTextField: UITextField!
    @IBOutlet weak var photoImageView: UIImageView!
    var imageData:NSData!
    var imagePath:NSURL!
    @IBAction func uploadPhotoAction(sender: UIButton) {
        
        picker!.allowsEditing = false
        picker!.sourceType = UIImagePickerControllerSourceType.PhotoLibrary
        presentViewController(picker!, animated: true, completion: nil)
        
    }
    
    var picker:UIImagePickerController?=UIImagePickerController()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        picker?.delegate=self
        
    }
    
    func imagePickerControllerDidCancel(picker: UIImagePickerController) {
        dismissViewControllerAnimated(true, completion: nil)
    }
    
    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [NSObject : AnyObject]) {
        var chosenImage = info[UIImagePickerControllerOriginalImage] as UIImage
        photoImageView.contentMode = .ScaleAspectFit
        photoImageView.image = chosenImage
        dismissViewControllerAnimated(true, completion: nil)
        imageData=UIImagePNGRepresentation(chosenImage)
        imagePath=info[UIImagePickerControllerReferenceURL] as NSURL
    }
    
    
    
    @IBAction func submitButtonAction(sender: UIButton) {
        var userName=userNameTextField.text;
        var password=passwordTextField.text;
        var confirmPassword=confirmPasswordTextField.text
        
        if(password==confirmPassword)
        {
            var nl:NetworkLayer=NetworkLayer()
            var returnData:NSData!=nl.connectToURL(signUpURL, postBody: ["name":userName,"password":password,"category":"user"], multipartFiles:[imagePath:imageData])// [String: String]())!
            var error:NSError? = nil
            if returnData != nil
            {
                if let jsonObject: AnyObject = NSJSONSerialization.JSONObjectWithData(returnData, options: nil, error:&error) {
                    if let dict = jsonObject as? NSDictionary {
                        println(dict)
                        var error_code: NSNumber?=dict.objectForKey("error_code") as? NSNumber
                        var message:NSString=dict.objectForKey("error_message") as NSString;
                        if (error_code?.integerValue==0)
                        {
                            println("show donator screen");
                            var userDonations:DonateViewController=DonateViewController()
                            userDonations.username=userName
                            self.navigationController!.pushViewController(userDonations, animated: true)
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
                var alert:UIAlertView=UIAlertView(title: "Error", message: "Error while connecting to server", delegate: nil, cancelButtonTitle: "OK")
                alert.show()
            }
            
        }
        else
        {
            var alert:UIAlertView=UIAlertView(title: "Error", message: "The passwords do not match", delegate: nil, cancelButtonTitle: "OK")
            alert.show()
        }
        
        
        
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

