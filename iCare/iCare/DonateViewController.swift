//
//  DonateViewController.swift
//  iCare
//
//  Created by Aishwarya on 09/12/15.
//  Copyright (c) 2015 Aishwarya. All rights reserved.
//

import UIKit



class DonateViewController: UIViewController {


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

