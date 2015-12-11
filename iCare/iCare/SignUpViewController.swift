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
    var imagePath:NSString = ""
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
        var imageURL:NSURL=info[UIImagePickerControllerReferenceURL] as NSURL
        imagePath=imageURL.path!
    }

    
    
    @IBAction func submitButtonAction(sender: UIButton) {
        var userName=userNameTextField.text;
        var password=passwordTextField.text;
        var confirmPassword=confirmPasswordTextField.text
        
        if(password==confirmPassword)
        {
            var nl:NetworkLayer=NetworkLayer()
            var returnData:NSData=nl.connectToURLWithMultipartData(signUpURL, jsonData: ["user_name":userName,"password":password], multipartFiles: [userName:imagePath])
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
    
    
}

